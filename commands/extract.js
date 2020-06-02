import React, { Fragment, useEffect, useState } from "react";
import AdmZip from "adm-zip";
import fs from "fs";
import { Color } from "ink";

import { SelectFile, Timestamp } from "../src/components";
import { useAdmZip } from "../src/hooks";
import { getFiles, updateStoreConfigs } from "../src/utils";

/// Extract store backup zip files
function extract() {
  const [extractedText, extractedError] = useAdmZip();

  const handleSelect = async ({ value }) => {
    const zip = new AdmZip(value);

    try {
      zip.extractAllTo(`${process.cwd()}/store`, true);
    } catch (error) {
      setExtractError(error);
    }

    const files = await getFiles(`${process.cwd()}/store`);
    await fs.promises.writeFile(
      `${process.cwd()}/modified-snapshot.json`,
      JSON.stringify(files, null, 2)
    );

    await updateStoreConfigs();

    setExtractedText(value);
  };

  return (
    <Fragment>
      {!extractedText ? (
        <SelectFile
          label="Select a file to extract below:"
          onSelect={handleSelect}
          path={"/extract/store/*.zip"}
        />
      ) : (
        <Timestamp
          action="extracted"
          actionColor="blue"
          message={extractedText}
        />
      )}
    </Fragment>
  );
}

export default extract;
