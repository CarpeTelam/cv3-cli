import React, { useEffect, useState } from "react";
import AdmZip from "adm-zip";
import fs from "fs";

import { getFiles } from "../utils";

function useAdmZip(source, destination) {
  const [extractError, setExtractError] = useState();
  const [extractedText, setExtractedText] = useState("");

  useEffect(() => {
    async function extract() {
      const zip = new AdmZip(source);

      try {
        zip.extractAllTo(destination, true);
      } catch (error) {
        setExtractError(error);
      }

      setExtractedText(source);
    }

    extract();
  }, []);

  return [extractedText, extractedError];
}

export default useAdmZip;
