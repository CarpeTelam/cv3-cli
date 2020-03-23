import React from "react";
import { Box } from "ink";
import openBrowser from "open";

import { loadJSONSync } from "../src/utils";

const basePath = process.cwd();
const storePath = `${basePath}/store.json`;
const store = loadJSONSync(storePath);

function open() {
  openBrowser(store.stagingURL);

  return <Box>{store.stagingURL} opening in default browser...</Box>;
}

export default open;
