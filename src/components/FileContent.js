import React from "react";
import PropTypes from "prop-types";
import fs from "fs";
import { Box, Color, Text } from "ink";

function FileContent(props) {
  const json = JSON.parse(fs.readFileSync(props.file));
  return (
    <Box flexDirection="column">
      {props.label && <Box>{props.label}</Box>}
      <Box>{"{"}</Box>
      {Object.keys(json).map(function(key, index) {
        return (
          <Box key={key}>
            {"  "}
            <Color keyword={props.keyColor}>{key}</Color>
            {": "}
            <Color keyword={props.valueColor}>{json[key]}</Color>
          </Box>
        );
      })}
      <Box>{"}"}</Box>
    </Box>
  );
}

FileContent.propTypes = {
  file: PropTypes.string.isRequired,
  label: PropTypes.string,
  keyColor: PropTypes.string,
  valueColor: PropTypes.string
};

FileContent.defaultProps = {
  keyColor: "white",
  valueColor: "red"
};

export default FileContent;
