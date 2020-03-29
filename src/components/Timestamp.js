import React from "react";
import moment from "moment";
import { Color } from "ink";

function Timestamp() {
  return (
    <Color blackBright>{`${moment().format("YYYY-MM-D HH:mm:ss.SSS")} `}</Color>
  );
}

export default Timestamp;
