import React, { useEffect, useState } from "react";
import request from "request-promise";
import { jar } from "request";

import { loadJSONSync } from "../utils";

function useCv3Client(defaultResponse = {}, defaultError) {
  const [response, setResponse] = useState(defaultResponse);
  const [error, setError] = useState(defaultError);

  const root = process.cwd();
  const cv3CredentialsPath = `${root}/cv3-credentials.json`;
  const storePath = `${root}/store.json`;

  const cv3Credentials = loadJSONSync(cv3CredentialsPath);
  const store = loadJSONSync(storePath);

  useEffect(() => {
    async function fetchURL() {
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
        setResponse(
          await request({
            headers: {
              "User-Agent": "CV3 CLI: Update Template"
            },
            jar: cookieJar,
            json: true,
            method: "GET",
            resolveWithFullResponse: true,
            uri: `https://store.commercev3.com/GetData/template_list/${store.id}`
          })
        );
      } catch (error) {
        setError(error);
      }
    }

    fetchURL();
  }, []);

  return [response, error];
}

export default useCv3Client;
