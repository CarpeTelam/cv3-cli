import React, { useEffect, useReducer, useState } from "react";
import request from "request-promise";
import { jar } from "request";
import { isEmpty, isObject } from "lodash";

import useLoadJSON from "./use-load-json";

function postTemplateReducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, error: false, isLoading: true };
    case "SUCCESS":
      return {
        ...state,
        error: false,
        isLoading: false,
        response: action.payload
      };
    case "FAILURE":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Invalid action type");
  }
}

function useCV3PostTemplate(initialForm, initialResponse) {
  const [form, setForm] = useState(initialForm);

  const [cv3Credentials, cv3CredentialsError] = useLoadJSON(
    `${process.cwd()}/cv3-credentials.json`
  );
  const [storeConfigs, storeConfigsError] = useLoadJSON(
    `${process.cwd()}/store-configs.json`
  );

  const [state, dispatch] = useReducer(postTemplateReducer, {
    error: false,
    isLoading: true,
    response: initialResponse
  });

  useEffect(() => {
    async function postTemplate() {
      if (isObject(form) && !isEmpty(form.filename)) {
        dispatch({ type: "INIT" });

        const options = {
          followAllRedirects: true,
          headers: {
            "User-Agent": "CV3 CLI: Post Template"
          },
          jar: jar(),
          json: true,
          resolveWithFullResponse: true,
          simple: false
        };

        try {
          await request({
            ...options,
            form: {
              action: "Login",
              username: cv3Credentials.username,
              password: cv3Credentials.password
            },
            method: "POST",
            uri: "https://store.commercev3.com"
          });
          const getDataResponse = await request({
            ...options,
            method: "GET",
            uri: `https://store.commercev3.com/GetData/template_edit/${storeConfigs.id}/${form.filename}`
          });
          const data = getDataResponse.body;
          const defaultForm = {
            action: "EditTemplate",
            locked: data.locked.locked_status,
            stylesheet_locked: data.stylesheet_locked.locked_status,
            title: data.meta.title,
            description: data.meta.description,
            keywords: data.meta.keywords,
            styles: data.styles,
            curr_category: data.cats.template,
            category: data.cats.template,
            common_name: data.common_name,
            curr_common_name: data.common_name,
            template: data.template,
            filename: data.filename,
            override_img_prefix: data.override_img_prefix,
            submit: "Save"
          };
          // TODO: Can we add somethign to this request to be redirected to GetData instead of ShowView?
          // This would allow us to get rid of the extrac GetData call below.
          await request({
            ...options,
            form: { ...defaultForm, ...form },
            method: "POST",
            uri: "https://store.commercev3.com"
          });
          const response = await request({
            ...options,
            method: "GET",
            uri: `https://store.commercev3.com/GetData/template_edit/${storeConfigs.id}/${form.filename}`
          });
          dispatch({ type: "SUCCESS", payload: response });
        } catch (error) {
          dispatch({ type: "FAILURE", payload: error });
        }
      }
    }

    postTemplate();
  }, [form]);

  return [state, setForm];
}

export default useCV3PostTemplate;
