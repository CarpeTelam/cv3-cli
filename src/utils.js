import fs from "fs";

export function loadJSONSync(path) {
  if (!fs.existsSync(path)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(path));
}
