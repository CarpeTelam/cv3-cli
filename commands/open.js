import React from "react";
import openBrowser from "open";
import { Box, Color } from "ink";

import { useLoadJSON } from "../src/hooks";
import { Timestamp } from "../src/components";

function open() {
  const root = process.cwd();
  const storeConfigsPath = `${root}/store-config.json`;
  const [storeConfigs, storeConfigsError] = useLoadJSON(storeConfigsPath);

  if (storeConfigsError) {
    return <Color keyword="red">{storeConfigsError.message}</Color>;
  }

  openBrowser(storeConfigs.stagingURL);

  return (
    <Box>
      <Timestamp />
      {` ${storeConfigs.stagingURL} `}
      <Color keyword="blue">opened</Color>
    </Box>
  );
}

export default open;
