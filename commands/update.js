import React, { Fragment, useEffect, useState } from "react";
import { Box } from "ink";

import { cv3PostTemplate } from "../src/clients";
import { Loading, Timestamp } from "../src/components";
import { useCV3PostTemplate } from "../src/hooks";
import { getModifiedFiles, updateStoreConfigs } from "../src/utils";

function update() {
  const [files, setFiles] = useState([]);
  const [responses, setResponses] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    async function updateFiles() {
      try {
        const modifiedFiles = await getModifiedFiles({
          dir: `${process.cwd()}/store`,
          extension: "tpl"
        });
        setFiles(modifiedFiles);
        await updateStoreConfigs();

        await Promise.all(
          modifiedFiles.forEach(async file => {
            const response = await cv3PostTemplate({
              filename: file.filename,
              template: file.template
            });
            setResponses({
              ...responses,
              [file.path]: response
            });
          })
        );
      } catch (error) {
        setError(error);
      }
    }
    updateFiles();
  }, []);

  return (
    <Box flexDirection="column">
      {files.length > 0 && (
        <Fragment>
          {files.map(file => (
            <Fragment key={file.path}>
              <Timestamp
                action="modified"
                actionColor="yellow"
                message={file.path}
              />
              {typeof responses[file.path] === "undefined" ? (
                <Loading />
              ) : (
                <Timestamp
                  action="updated"
                  actionColor="green"
                  message={responses[file.path].body["SCRIPT_NAME"].replace(
                    "/GetData",
                    "https://store.commercev3.com/ShowView"
                  )}
                />
              )}
            </Fragment>
          ))}
        </Fragment>
      )}
    </Box>
  );
}

export default update;
