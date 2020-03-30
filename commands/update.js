import React, { useEffect, useState } from "react";
import request from "request-promise";
import moment from "moment";
import { jar } from "request";
import { Box } from "ink";
import { findIndex, sortBy } from "lodash";

import { useCV3GetData } from "../src/hooks";
import { Timestamp } from "../src/components";

function update() {
  const [state, setURL] = useCV3GetData("template_edit", "_header.tpl");

  console.log(state);

  return <Box flexDirection="column"></Box>;
}

export default update;
