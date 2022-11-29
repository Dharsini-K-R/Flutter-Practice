import { set, get } from "idb-keyval";
import { getImage } from "msa2-ui/src/api/repository";

const currentCCLAVersion = process.env.REACT_APP_MSA_VERSION;
const CCLAVersion = "cclaVersion";
const CCLAData = "cclaData";

/**
 * Save the current state to indexedDB. This method is fire and forget.
 * We call the operation to set the data in indexed Db but we don't wait to see if it succeeded.
 * @param state comes from the REDUX store
 */
export const saveStateToStorage = (state) => {
  const serializedState = JSON.stringify(state);

  set(CCLAData, serializedState).catch((error) =>
    console.log("CCLA : Error saving state to storage", error),
  );
  set(CCLAVersion, currentCCLAVersion).catch((error) =>
    console.log("CCLA : Error saving version to storage", error),
  );
};

/**
 * Loads the state saved in indexDb and deserialize it.
 * @returns {Promise<undefined>}
 */
export const loadStateFromStorage = async () => {
  const storedCclaVersion = await getValueFromIDB(CCLAVersion);

  /**
   *  will never be read from local storage.
   *  If the currentCCLAVersion has changed on another environment,
   *  we will not load the stored state to prevent any conflicts in
   *  the expected state shape.
   **/
  if (currentCCLAVersion && currentCCLAVersion !== storedCclaVersion) {
    return;
  }

  const serializedState = await getValueFromIDB(CCLAData);
  return serializedState ? JSON.parse(serializedState) : undefined;
};

/**
 * Method that  retrieves data from indexed DB based on the key
 * @param key: The key in indexedDB who's value will be returned if it exists
 * @returns {Promise<any>} returns the the database value
 */
const getValueFromIDB = async (key) => {
  try {
    return await get(key);
  } catch (e) {
    console.log("CCLA UI: Error - Could not read from IndexedDB.");
  }
};

/**
 * Method that  retrieves data from indexed DB based on the key
 * @param key: The key in indexedDB who's value will be returned if it exists
 * @returns {Promise<any>} returns the the database value
 */
export const getImageCache = async ({ path, token }) => {
  const cachedImage = await getValueFromIDB(path);
  if (cachedImage) {
    const url = URL.createObjectURL(cachedImage);
    return { url, blob: cachedImage };
  }
  if (!token) return {};
  const [error, { blob, url } = {}] = await getImage({ token, path });
  // can do in background in async
  if (!error && Boolean(blob)) {
    set(path, blob);
    return { url, blob };
  }
  return {};
};
