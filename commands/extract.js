import React, { Fragment, useContext, useEffect, useState } from "react";
import AdmZip from "adm-zip";
import fs from "fs";
import glob from "glob-promise";
import { AppContext, Box, Color } from "ink";
import Select from "ink-select-input";

import { Timestamp } from "../src/components";
import { checkStoreConfigs, getFiles, updateStoreConfigs } from "../src/utils";

function extract() {
  const [items, setItems] = useState([]);
  const [globError, setGlobError] = useState("");
  const [extractError, setExtractError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const { exit } = useContext(AppContext);

  const [storeConfigs, storeConfigsError] = checkStoreConfigs();

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

    await updateStorecConfigs();

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
