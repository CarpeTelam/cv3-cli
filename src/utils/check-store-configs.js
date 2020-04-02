import { useLoadJSON } from "../hooks";

function checkStoreConfigs() {
  const storeConfigsPath = `${process.cwd()}/store-configs.json`;

  return useLoadJSON(storeConfigsPath);
}

export default checkStoreConfigs;
