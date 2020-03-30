import React from "react";
import PropTypes from "prop-types";
import Spinner from "ink-spinner";
import { Box, Color } from "ink";

function Loading(props) {
  return (
    <Box>
      <Box marginRight={1}>
        <Color keyword={props.spinnerColor}>
          <Spinner />
        </Color>
      </Box>
      {props.message}
    </Box>
  );
}

Loading.propTypes = {
  spinnerColor: PropTypes.string,
  text: PropTypes.string
};

Loading.defaultProps = {
  spinnerColor: "green",
  message: "Loading"
};

export default Loading;
