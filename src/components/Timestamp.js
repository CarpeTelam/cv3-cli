import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Box, Color } from "ink";

function Timestamp(props) {
  return (
    <Box>
      <Color blackBright>
        {`${moment().format("YYYY-MM-DD HH:mm:ss.SSS")} `}
      </Color>
      {props.message && `${props.message} `}
      {props.action && (
        <Color keyword={props.actionColor}>{props.action}</Color>
      )}
    </Box>
  );
}

Timestamp.propTypes = {
  action: PropTypes.string,
  actionColor: PropTypes.string,
  message: PropTypes.string
};

export default Timestamp;
