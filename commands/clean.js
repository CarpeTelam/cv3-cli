import React from "react";
import { Box, Color } from "ink";

import { useDel } from "../src/hooks";
import { Timestamp } from "../src/components/";

function clean() {
  const [deletedPaths, deletedError] = useDel([
    "./extract/store/*.zip",
    "./extract/bootstrap/bootstrap/",
    "./extract/bootstrap/*.zip"
  ]);

  return (
    <Box flexDirection="column">
      {deletedPaths.length > 0 ? (
        deletedPaths.map(deletedPath => (
          <Timestamp
            action="deleted"
            actionColor="red"
            key={deletedPath}
            message={deletedPath}
          />
        ))
      ) : (
        <Timestamp action="delete" actionColor="yellow" message="No files to" />
      )}
    </Box>
  );
}

export default clean;
