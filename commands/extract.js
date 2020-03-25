import React, { useContext, useEffect, useState } from "react";
import extractZip from "extract-zip";
import fs from "fs";
import glob from "glob-promise";
import moment from "moment";
import { isEmpty } from "lodash";
import { AppContext, Box, Color } from "ink";
import Select from "ink-select-input";

import { loadJSONSync } from "../src/utils";

function extract() {
  const [items, setItems] = useState([]);
  const [globError, setGlobError] = useState("");
  const [extractZipError, setExtractZipError] = useState("");
  const [footer, setFooter] = useState();
  const { exit } = useContext(AppContext);

  const root = process.cwd();
  const storePath = `${root}/store.json`;
  const store = loadJSONSync(storePath);

  if (isEmpty(store)) {
    return (
      <Box flexDirection="column">
        <Box>
          {storePath} <Color keyword="red">not found</Color>
        </Box>
        <Box>
          Please run <Color keyword="blue">cv3 init</Color> to create the proper
          config files.
        </Box>
      </Box>
    );
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

  const handleSelect = ({ value }) => {
    extractZip(value, { dir: `${root}/store` }, async error => {
      if (error) {
        setExtractError(error);
        return;
      }
      const timestamp = moment().unix();
      await fs.promises.writeFile(
        storePath,
        JSON.stringify({ ...store, timestamp }, null, 2)
      );
      setFooter(
        <Box>
          <Color blackBright>
            {`${moment(timestamp, "X").format("YYYY-MM-D HH:mm:ss.SSS")} `}
          </Color>
          {value} <Color keyword="blue">extracted</Color>
        </Box>
      );
      exit();
    });
  };

  return (
    <Box flexDirection="column">
      {items.length > 0 ? (
        <Box>
          Select a file to extract below:
          <Select items={items} onSelect={handleSelect} />
          {footer}
        </Box>
      ) : (
        <Box>
          <Color blackBright>
            {`${moment().format("YYYY-MM-D HH:mm:ss.SSS")} `}
          </Color>
          No files <Color keyword="blue">extracted</Color>
        </Box>
      )}
    </Box>
  );
}

export default extract;
