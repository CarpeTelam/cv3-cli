import React, { useEffect, useState } from "react";
import moment from "moment";
import del from "del";
import { Box, Color } from "ink";

function clean() {
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [error, setError] = useState();

  const root = process.cwd();
  const deletePaths = [
    `${root}/extract/store/*.zip`,
    `${root}/extract/bootstrap/bootstrap/`,
    `${root}/extract/bootstrap/*.zip`,
    `${root}/**/.DS_Store`
  ];

  useEffect(() => {
    async function deleteFiles() {
      try {
        const deletedFiles = await del(deletePaths);
        setDeletedFiles(deletedFiles);
      } catch (error) {
        setError(error);
      }
    }
    deleteFiles();
  }, []);

  return (
    <Box flexDirection="column">
      {deletedFiles.map(deletedFile => (
        <Box key={deletedFile}>
          <Color blackBright>
            {`${moment().format("YYYY-MM-D HH:mm:ss.SSS")} `}
          </Color>
          {deletedFile} <Color keyword="red">deleted</Color>
        </Box>
      ))}
    </Box>
  );
}

export default clean;
