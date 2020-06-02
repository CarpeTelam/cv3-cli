import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import glob from "glob-promise";
import { Box, Color } from "ink";
import Select from "ink-select-input";
import { find } from "lodash";

import { Loading, Timestamp } from "./";

function SelectFile(props) {
  const [path, setPath] = useState(props.path);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function processGlob() {
      setIsLoading(true);
      try {
        const files = await glob(path, {
          root: process.cwd()
        });
        setItems(
          files.map(file => {
            const fileSplit = file.split("/");
            return {
              label: fileSplit.slice(-1)[0],
              value: file
            };
          })
        );
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    }
    processGlob();
  }, [path]);

  return (
    <Box>
      {isLoading ? (
        <Loading />
      ) : (
        <Fragment>
          {items.length > 0 ? (
            <Fragment>
              {props.label}
              {error ? (
                <Color keyword="red">{error.message}</Color>
              ) : (
                <Select items={items} onSelect={props.onSelect} />
              )}
            </Fragment>
          ) : (
            <Timestamp action="found" actionColor="yellow" message="No files" />
          )}
        </Fragment>
      )}
    </Box>
  );
}

SelectFile.propTypes = {
  glob: PropTypes.string.isRequired,
  label: PropTypes.string,
  onSelect: PropTypes.func.isRequired
};

export default SelectFile;
