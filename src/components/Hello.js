import React from "react";
import PropTypes from "prop-types";
import { Color, Text } from "ink";

function Hello(props) {
  const color = props.name === "Stranger" ? "orange" : props.color;
  return (
    <Text>
      Hello, <Color keyword={color}>{props.name}</Color>
    </Text>
  );
}

Hello.propTypes = {
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default Hello;
