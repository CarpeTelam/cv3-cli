import React, { useEffect, useState } from "react";
import moment from "moment";
import del from "del";
import { Box, Color } from "ink";

function clean() {
  const basePath = process.cwd();
  const deletePaths = [
    `${basePath}/extract/store/*.zip`,
    `${basePath}/extract/bootstrap/bootstrap/`,
    `${basePath}/extract/bootstrap/*.zip`,
    `${basePath}/**/.DS_Store`
  ];

  // ToDo: Fix this to use pastel output instead of console.log
  (async () => {
    const response = await del(deletePaths);
    if (response.length > 0) {
      console.log(`Deleted files: \n${JSON.stringify(response, null, 2)}`);
    } else {
      console.log("No files to delete");
    }
  })();

  return <Box />;
}

export default clean;
