import React from "react";
import PropTypes from "prop-types";
import { Color } from "ink";

function Quit(props) {
  return <Color keyword={props.color}>{props.message}</Color>;
}

Quit.propTypes = {
  color: PropTypes.string,
  message: PropTypes.string
};

Quit.defaultProps = {
  color: "magenta",
  message: "Goodbye!"
};

export default Quit;
