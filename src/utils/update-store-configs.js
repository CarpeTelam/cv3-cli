import fs from "fs";
import moment from "moment";

import { useLoadJSON } from "../hooks";

async function updateStoreConfigs() {
  const storeConfigsPath = `${process.cwd()}/store-configs.json`;
  const [storeConfigs, storeConfigsError] = useLoadJSON(storeConfigsPath);

  const timestamp = moment().unix();
  await fs.promises.writeFile(
    storeConfigsPath,
    JSON.stringify({ ...storeConfigs, timestamp }, null, 2)
  );
}

export default updateStoreConfigs;
