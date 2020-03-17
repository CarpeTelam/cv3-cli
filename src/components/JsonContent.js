import React from "react";
import PropTypes from "prop-types";
import fs from "fs";
import { Box, Color, Text } from "ink";

function JsonContent(props) {
  return (
    <Box flexDirection="column">
      {props.label && <Box>{props.label}</Box>}
      <Color keyword={props.baseColor}>
        <Box flexDirection="column">
          <Box>{"{"}</Box>
          {Object.keys(props.json).map(function(key, index) {
            return (
              <Box key={key}>
                {"  "}
                <Color keyword={props.keyColor}>{key}</Color>
                {": "}
                <Color keyword={props.valueColor}>
                  {JSON.stringify(props.json[key])}
                </Color>
              </Box>
            );
          })}
          <Box>{"}"}</Box>
        </Box>
      </Color>
    </Box>
  );
}

JsonContent.propTypes = {
  baseColor: PropTypes.string,
  json: PropTypes.object.isRequired,
  keyColor: PropTypes.string,
  label: PropTypes.string,
  labelColor: PropTypes.string,
  valueColor: PropTypes.string
};

JsonContent.defaultProps = {
  baseColor: "white",
  labelColor: "white"
};

export default JsonContent;
