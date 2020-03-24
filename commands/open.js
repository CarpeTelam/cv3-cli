import React from "react";
import moment from "moment";
import openBrowser from "open";
import { Box, Color } from "ink";

import { loadJSONSync } from "../src/utils";

function open() {
  const basePath = process.cwd();
  const storePath = `${basePath}/store.json`;
  const store = loadJSONSync(storePath);

  openBrowser(store.stagingURL);

  return (
    <Box>
      <Color blackBright>
        {`${moment().format("YYYY-MM-D HH:mm:ss.SSS")} `}
      </Color>
      <Color keyword="blue">{store.stagingURL}</Color>
      {` opening in default browser...`}
    </Box>
  );
}

export default open;
