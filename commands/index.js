import React from "react";
import PropTypes from "prop-types";
import { Text } from "ink";

import Hello from "../src/components/Hello";

/// CV3 CLI tool for local development
function CV3(props) {
  return <Hello name={props.name} />;
}

CV3.propTypes = {
  /// The "name" option can be used to alter the greeting
  name: PropTypes.string.isRequired
};

CV3.defaultProps = {
  name: "Stranger"
};

export default CV3;
