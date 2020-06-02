import fs from "fs";
import path from "path";
import moment from "moment";

import { checkStoreConfigs } from "../utils";

async function getModifiedFiles(props) {
  const [storeConfigs, storeConfigsError] = checkStoreConfigs();

  const dirents = await fs.promises.readdir(props.dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const resolvedPath = path.resolve(props.dir, dirent.name);
      if (dirent.isDirectory()) {
        return getModifiedFiles({ ...props, dir: resolvedPath });
      }
      const pathInfo = resolvedPath.split("/");
      const filename = pathInfo.slice(-1)[0];
      const fileInfo = filename.split(".");
      const extension = fileInfo.slice(-1)[0];
      const template = fs.readFileSync(resolvedPath);
      const { mtime } = fs.statSync(resolvedPath);
      const modified = moment(mtime).unix();
      return { extension, filename, path: resolvedPath, template, modified };
    })
  );
  const modifiedFiles = files
    .flat()
    .filter(
      file =>
        file.modified > storeConfigs.timestamp &&
        file.extension === props.extension
    );
  return modifiedFiles;
}

export default getModifiedFiles;
