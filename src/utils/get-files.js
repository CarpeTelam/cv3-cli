import fs from "fs";
import path from "path";
import moment from "moment";

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const resolved = path.resolve(dir, dirent.name);
      const { mtime } = fs.statSync(resolved);
      return dirent.isDirectory()
        ? getFiles(resolved)
        : {
            path: resolved.replace(process.cwd(), ""),
            modified: moment(mtime).unix()
          };
    })
  );
  return [].concat(...files);
}

export default getFiles;
