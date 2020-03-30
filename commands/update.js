import React from "react";
import { Box } from "ink";

import { useCV3GetData } from "../src/hooks";
import { Loading, Timestamp } from "../src/components";

function update() {
  const [state, setPath] = useCV3GetData(
    {
      view: "template_edit",
      slug: "_header.tpl"
    },
    { body: { template: "" } }
  );

  return (
    <Box flexDirection="column">
      {state.isLoading ? (
        <Loading />
      ) : (
        <Timestamp message={state.response.body.template} />
      )}
    </Box>
  );
}

export default update;
