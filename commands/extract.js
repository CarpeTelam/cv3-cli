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

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const resolved = path.resolve(dir, dirent.name);
      const { mtime } = fs.statSync(resolved);
      return dirent.isDirectory()
        ? getFiles(resolved)
        : {
            path: resolved.replace(process.cwd(), ""),
            modified: moment(mtime).unix()
          };
    })
  );
  return [].concat(...files);
}

function extract() {
  const [items, setItems] = useState([]);
  const [globError, setGlobError] = useState("");
  const [extractError, setExtractError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const { exit } = useContext(AppContext);

  const storeConfigsPath = `${process.cwd()}/store-configs.json`;
  const [storeConfigs, storeConfigsError] = useLoadJSON(storeConfigsPath);

  if (storeConfigsError) {
    return <Color keyword="red">{storeConfigsError.message}</Color>;
  }

  useEffect(() => {
    async function processFiles(source) {
      try {
        const filePaths = await glob(`${source}/*.zip`, {
          root: process.cwd()
        });
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

  const handleSelect = async ({ value }) => {
    const zip = new AdmZip(value);

    try {
      zip.extractAllTo(`${process.cwd()}/store`, true);
    } catch (error) {
      setExtractError(error);
    }

    const files = await getFiles(`${process.cwd()}/store`);
    await fs.promises.writeFile(
      `${process.cwd()}/modified-snapshot.json`,
      JSON.stringify(files, null, 2)
    );

    const timestamp = moment().unix();
    await fs.promises.writeFile(
      storePath,
      JSON.stringify({ ...store, timestamp }, null, 2)
    );

    setExtractedText(
      <Timestamp action="extracted" actionColor="blue" message={value} />
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
        <Timestamp
          action="extract"
          actionColor="yellow"
          message="No files to"
        />
      )}
    </Fragment>
  );
}

export default extract;
