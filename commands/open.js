import React from "react";
import openBrowser from "open";
import { Color } from "ink";

import { Timestamp } from "../src/components";
import { checkStoreConfigs } from "../src/utils";

function open() {
  const [storeConfigs, storeConfigsError] = checkStoreConfigs();

  if (storeConfigsError) {
    return <Color keyword="red">{storeConfigsError.message}</Color>;
  }

  openBrowser(storeConfigs.stagingURL);

  return (
    <Timestamp
      action="opened"
      actionColor="blue"
      message={storeConfigs.stagingURL}
    />
  );
}

export default open;
