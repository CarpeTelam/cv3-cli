import React from "react";
import moment from "moment";
import openBrowser from "open";
import { Box, Color } from "ink";
import { isEmpty } from "lodash";

import { loadJSONSync } from "../src/utils";

function open() {
  const root = process.cwd();
  const storePath = `${root}/store.json`;
  const store = loadJSONSync(storePath);

  if (isEmpty(store) || store.stagingURL === "") {
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

  openBrowser(store.stagingURL);

  return (
    <Box>
      <Color blackBright>
        {`${moment().format("YYYY-MM-D HH:mm:ss.SSS")} `}
      </Color>
      {store.stagingURL} <Color keyword="blue">opened</Color>
    </Box>
  );
}

export default open;
