import React, { Fragment, useContext, useEffect, useState } from "react";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";
import glob from "glob-promise";
import moment from "moment";
import { isEmpty } from "lodash";
import { AppContext, Box, Color } from "ink";
import Select from "ink-select-input";

import { useLoadJSON } from "../src/hooks";
import { Timestamp } from "../src/components";

function extract() {
  const [items, setItems] = useState([]);
  const [globError, setGlobError] = useState("");
  const [extractError, setExtractError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const { exit } = useContext(AppContext);

  const root = process.cwd();
  const storeConfigsPath = `${root}/store-config.json`;
  const [storeConfigs, storeConfigsError] = useLoadJSON(storeConfigsPath);

  if (storeConfigsError) {
    return <Color keyword="red">{storeConfigsError.message}</Color>;
  }

  useEffect(() => {
    async function processFiles(source) {
      try {
        const filePaths = await glob(`${source}/*.zip`, { root });
        setItems(
          filePaths.map(filePath => {
            const filePathSplit = filePath.split("/");
            return {
              label: filePathSplit.slice(-1)[0],
              value: filePath
            };
          })
        );
      } catch (error) {
        setGlobError(error);
      }
    }
    processFiles("/extract/store");
  }, []);

  async function getFiles(dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map(dirent => {
        const resolved = path.resolve(dir, dirent.name);
        const { mtime } = fs.statSync(resolved);
        return dirent.isDirectory()
          ? getFiles(resolved)
          : {
              path: resolved.replace(root, ""),
              modified: moment(mtime).unix()
            };
      })
    );
    return [].concat(...files);
  }

  const handleSelect = async ({ value }) => {
    const zip = new AdmZip(value);

    try {
      zip.extractAllTo(`${root}/store`, true);
    } catch (error) {
      setExtractError(error);
    }

    const files = await getFiles(`${root}/store`);
    await fs.promises.writeFile(
      `${root}/modified-snapshot.json`,
      JSON.stringify(files, null, 2)
    );

    const timestamp = moment().unix();
    await fs.promises.writeFile(
      storePath,
      JSON.stringify({ ...store, timestamp }, null, 2)
    );

    setExtractedText(
      <Box>
        <Timestamp /> {value} <Color keyword="blue">extracted</Color>
      </Box>
    );

    exit();
  };

  return (
    <Fragment>
      {items.length > 0 ? (
        !extractedText ? (
          <Box flexDirection="column">
            Select a file to extract below:
            <Select items={items} onSelect={handleSelect} />
          </Box>
        ) : (
          extractedText
        )
      ) : (
        <Box>
          <Timestamp />
          No files to <Color keyword="yellow">extract</Color>
        </Box>
      )}
    </Fragment>
  );
}

export default extract;
