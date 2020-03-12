import React from "react";
import PropTypes from "prop-types";
import { Box } from "ink";

/// CV3 CLI tool for local development
function CV3(props) {
  return <Box>cv3 cli</Box>;
}

CV3.propTypes = {
  /// The "color" option can be used to alter the greeting's color
  color: PropTypes.string,
  /// The "name" option can be used to alter the greeting
  name: PropTypes.string
};

CV3.defaultProps = {
  color: "blue",
  name: "Stranger"
};

export default CV3;
