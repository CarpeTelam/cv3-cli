import fs from "fs";

import { getFiles } from "./";

async function createModifiedSnapshot(source) {
  const files = await getFiles(source);
  await fs.promises.writeFile(
    `${process.cwd()}/modified-snapshot.json`,
    JSON.stringify(files, null, 2)
  );
}

export default createModifiedSnapshot;
