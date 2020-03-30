import React from "react";
import { Box } from "ink";

import { useCV3GetData } from "../src/hooks";
import { Timestamp } from "../src/components";

function update() {
  const [state, setPath] = useCV3GetData(
    {
      view: "template_edit",
      slug: "_header.tpl"
    },
    { data: { template: "" } }
  );

  return (
    <Box flexDirection="column">
      <Timestamp message={state.data.template} />
    </Box>
  );
}

export default update;
