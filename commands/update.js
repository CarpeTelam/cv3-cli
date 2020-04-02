import React, { Fragment, useEffect, useState } from "react";
import fs from "fs";
import path from "path";
import moment from "moment";
import request from "request-promise";
import { jar } from "request";

import { useCV3PostTemplate, useLoadJSON } from "../src/hooks";
import { Loading, Timestamp } from "../src/components";

async function getModifiedFiles(props) {
  const dirents = await fs.promises.readdir(props.dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const resolvedPath = path.resolve(props.dir, dirent.name);
      if (dirent.isDirectory()) {
        return getModifiedFiles({ ...props, dir: resolvedPath });
      }
      const pathInfo = resolvedPath.split("/");
      const filename = pathInfo[pathInfo.length - 1];
      const fileInfo = filename.split(".");
      const extension = fileInfo[fileInfo.length - 1];
      const template = fs.readFileSync(resolvedPath);
      const { mtime } = fs.statSync(resolvedPath);
      const modified = moment(mtime).unix();
      return { extension, filename, template, modified };
    })
  );
  const modifiedFiles = files
    .flat()
    .filter(
      file =>
        file.modified > props.timestamp && file.extension === props.extension
    );
  return modifiedFiles;
}

function update() {
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState({});
  const [error, setError] = useState();

  const [cv3Credentials, cv3CredentialsError] = useLoadJSON(
    `${process.cwd()}/cv3-credentials.json`
  );
  const [storeConfigs, storeConfigsError] = useLoadJSON(
    `${process.cwd()}/store-configs.json`
  );

  useEffect(() => {
    async function updateFiles() {
      try {
        const modifiedFiles = await getModifiedFiles({
          dir: `${process.cwd()}/store`,
          timestamp: storeConfigs.timestamp,
          extension: "tpl"
        });
        setFiles(modifiedFiles);

        await Promise.all(
          modifiedFiles.forEach(async file => {
            const form = {
              filename: file.filename,
              template: file.template
            };

            const options = {
              followAllRedirects: true,
              headers: {
                "User-Agent": "CV3 CLI: Post Template"
              },
              jar: jar(),
              json: true,
              resolveWithFullResponse: true,
              simple: false
            };

            await request({
              ...options,
              form: {
                action: "Login",
                username: cv3Credentials.username,
                password: cv3Credentials.password
              },
              method: "POST",
              uri: "https://store.commercev3.com"
            });
            const getDataResponse = await request({
              ...options,
              method: "GET",
              uri: `https://store.commercev3.com/GetData/template_edit/${storeConfigs.id}/${form.filename}`
            });
            const data = getDataResponse.body;
            const defaultForm = {
              action: "EditTemplate",
              locked: data.locked.locked_status,
              stylesheet_locked: data.stylesheet_locked.locked_status,
              title: data.meta.title,
              description: data.meta.description,
              keywords: data.meta.keywords,
              styles: data.styles,
              curr_category: data.cats.template,
              category: data.cats.template,
              common_name: data.common_name,
              curr_common_name: data.common_name,
              template: data.template,
              filename: data.filename,
              override_img_prefix: data.override_img_prefix,
              submit: "Save"
            };
            // TODO: Can we add somethign to this request to be redirected to GetData instead of ShowView?
            // This would allow us to get rid of the extrac GetData call below.
            await request({
              ...options,
              form: { ...defaultForm, ...form },
              method: "POST",
              uri: "https://store.commercev3.com"
            });
            const updatedResponse = await request({
              ...options,
              method: "GET",
              uri: `https://store.commercev3.com/GetData/template_edit/${storeConfigs.id}/${form.filename}`
            });
            setResponse({ ...response, ...updatedResponse });
          })
        );
      } catch (error) {
        setError(error);
      }
    }
    updateFiles();
  }, []);

  return (
    <Fragment>
      <Timestamp message={JSON.stringify(files)} />
      <Timestamp message={JSON.stringify(response)} />
    </Fragment>
  );
}

export default update;
