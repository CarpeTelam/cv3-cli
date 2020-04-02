import React, { useEffect, useReducer, useState } from "react";
import request from "request-promise";
import { jar } from "request";
import { isEmpty, isObject } from "lodash";

import { useLoadJSON } from "../hooks";

async function cv3PostTemplate(form) {
  if (!isObject(form) || isEmpty(form.filename)) {
    throw new Error("form.filename is not set");
  }

  const [cv3Credentials, cv3CredentialsError] = useLoadJSON(
    `${process.cwd()}/cv3-credentials.json`
  );
  const [storeConfigs, storeConfigsError] = useLoadJSON(
    `${process.cwd()}/store-configs.json`
  );

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
    return response;
  } catch (error) {
    throw error;
  }
}

export default cv3PostTemplate;
