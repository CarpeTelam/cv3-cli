import React from "react";
import { Box, Color } from "ink";

import { useDel } from "../src/hooks";
import { Timestamp } from "../src/components/";

function clean() {
  const [files, error] = useDel([
    "./extract/store/*.zip",
    "./extract/bootstrap/bootstrap/",
    "./extract/bootstrap/*.zip"
  ]);

  return (
    <Box flexDirection="column">
      {files.length > 0 ? (
        files.map(file => (
          <Box key={file}>
            <Timestamp /> {file} <Color keyword="red">deleted</Color>
          </Box>
        ))
      ) : (
        <Box>
          <Timestamp /> No files to <Color keyword="yellow">delete</Color>
        </Box>
      )}
    </Box>
  );
}

export default clean;
