import React, { useState } from "react";
import fs from "fs";
import { isEmpty } from "lodash";

function useLoadJSON(path) {
  const content = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  const error = isEmpty(content) ? new Error(`${path} not found`) : undefined;

  return [content, error];
}

export default useLoadJSON;
