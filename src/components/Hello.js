import React from "react";
import PropTypes from "prop-types";
import { Text } from "ink";

function Hello(props) {
  return <Text>Hello, {props.name}</Text>;
}

Hello.propTypes = {
  name: PropTypes.string.isRequired
};

export default Hello;
