import React, { Fragment, useEffect, useReducer, useState } from "react";
import request from "request-promise";
import { jar } from "request";

import useLoadJSON from "./use-load-json";

function getDataReducer(state, action) {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, error: false, isLoading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        error: false,
        isLoading: false,
        response: action.payload
      };
    case "FETCH_FAILURE":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Invalid action type");
  }
}

function useCV3GetData(initialPath, initialResponse) {
  const [path, setPath] = useState(initialPath);

  const [cv3Credentials, cv3CredentialsError] = useLoadJSON(
    `${process.cwd()}/cv3-credentials.json`
  );
  const [storeConfigs, storeConfigsError] = useLoadJSON(
    `${process.cwd()}/store-configs.json`
  );

  const [state, dispatch] = useReducer(getDataReducer, {
    error: false,
    isLoading: true,
    response: initialResponse
  });

  useEffect(() => {
    async function getData() {
      dispatch({ type: "FETCH_INIT" });

      let cookieJar = jar();

      try {
        await request({
          form: {
            action: "Login",
            username: cv3Credentials.username,
            password: cv3Credentials.password
          },
          headers: {
            "User-Agent": "CV3 CLI: Update Template"
          },
          jar: cookieJar,
          method: "POST",
          resolveWithFullResponse: true,
          simple: false,
          uri: "https://store.commercev3.com"
        });
        const response = await request({
          headers: {
            "User-Agent": "CV3 CLI: Update Template"
          },
          jar: cookieJar,
          json: true,
          method: "GET",
          resolveWithFullResponse: true,
          uri: `https://store.commercev3.com/GetData/${path.view}/${storeConfigs.id}/${path.slug}`
        });
        dispatch({ type: "FETCH_SUCCESS", payload: response });
      } catch (error) {
        dispatch({ type: "FETCH_FAILURE", payload: error });
      }
    }

    getData();
  }, [path]);

  return [state, setPath];
}

export default useCV3GetData;
