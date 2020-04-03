import fs from "fs";
import moment from "moment";

import { useLoadJSON } from "../hooks";

async function updateStoreConfigs(props) {
  const storeConfigsPath = `${process.cwd()}/store-configs.json`;
  const [storeConfigs, storeConfigsError] = useLoadJSON(storeConfigsPath);

  await fs.promises.writeFile(
    storeConfigsPath,
    JSON.stringify(
      { ...storeConfigs, timestamp: moment().unix(), ...props },
      null,
      2
    )
  );
}

export default updateStoreConfigs;
