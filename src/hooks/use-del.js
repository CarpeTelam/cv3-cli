import React, { useEffect, useState } from "react";
import del from "del";

function useDel(paths) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function deletePaths() {
      try {
        const files = await del(paths);
        setFiles(files);
      } catch (error) {
        setError(error);
      }
    }
    deletePaths();
  }, []);

  return [files, error];
}

export default useDel;
