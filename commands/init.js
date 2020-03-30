import React, { Fragment, useContext, useState } from "react";
import PropTypes from "prop-types";
import fs from "fs";
import moment from "moment";
import { AppContext, Box, Color } from "ink";

import { useLoadJSON } from "../src/hooks";
import { Input, Timestamp } from "../src/components";

/// Init CV3 store repo
function init() {
  const cv3CredentialsPath = `${process.cwd()}/cv3-credentials.json`;
  const storeConfigsPath = `${process.cwd()}/store-configs.json`;

  const [cv3Credentials, cv3CredentialsError] = useLoadJSON(cv3CredentialsPath);
  const [storeConfigs, storeConfigsError] = useLoadJSON(storeConfigsPath);

  const defaultInputs = {
    username: "",
    password: "",
    id: "",
    stagingURL: "",
    ...cv3Credentials,
    ...storeConfigs
  };

  const [inputs, setInputs] = useState(defaultInputs);
  const [focus, setFocus] = useState(0);
  const [cv3CredentialsFooter, setCv3CredentialsFooter] = useState();
  const [storeFooter, setStoreFooter] = useState();
  const { exit } = useContext(AppContext);

  const fields = [
    { name: "username", label: "CV3 Username:", type: "text" },
    { name: "password", label: "CV3 Password:", type: "password" },
    { name: "id", label: "Store ID:", type: "number" },
    { name: "stagingURL", label: "Staging URL:", type: "text" }
  ];

  function handleEscape() {
    setFocus(fields.length);
    exit();
  }

  function handleInput(input) {
    setInputs({ ...inputs, ...input });
  }

  function handleNext(input) {
    handleInput(input);
    if (focus < fields.length - 1) {
      setFocus(focus + 1);
    }
  }

  function handlePrevious(input) {
    handleInput(input);
    if (focus > 0) {
      setFocus(focus - 1);
    }
  }

  function handleReturn(input) {
    handleNext(input);
    if (focus === fields.length - 1) {
      setFocus(fields.length);
      writeConfigs().finally(() => exit());
    }
  }

  function writeConfigs() {
    const { username, password, id, stagingURL } = inputs;
    const timestamp = moment().unix();

    const cv3Credentials = JSON.stringify({ username, password }, null, 2);
    const storeConfigs = JSON.stringify({ id, stagingURL, timestamp }, null, 2);

    const cv3CredentialsPromise =
      username !== "" && password !== ""
        ? fs.promises.writeFile(cv3CredentialsPath, cv3Credentials)
        : Promise.reject(new Error("Username and/or Password blank"));

    const storeConfigsPromise =
      id !== "" || stagingURL !== ""
        ? fs.promises.writeFile(storeConfigsPath, storeConfigs)
        : Promise.reject(new Error("Store ID and Staging URL blank"));

    return Promise.all([
      cv3CredentialsPromise
        .then(() =>
          handleFooter({
            path: cv3CredentialsPath,
            setFooter: setCv3CredentialsFooter
          })
        )
        .catch(error =>
          handleFooter({
            path: cv3CredentialsPath,
            setFooter: setCv3CredentialsFooter,
            error
          })
        ),
      storeConfigsPromise
        .then(() =>
          handleFooter({ path: storeConfigsPath, setFooter: setStoreFooter })
        )
        .catch(error =>
          handleFooter({
            path: storeConfigsPath,
            setFooter: setStoreFooter,
            error
          })
        )
    ]);
  }

  function handleFooter({ path, setFooter, error }) {
    setFooter(
      <Box>
        {error ? (
          <Timestamp
            action={`not updated, error: ${error.message}`}
            actionColor="red"
            key={path}
            message={path}
          />
        ) : (
          <Timestamp action="updated" actionColor="green" message={path} />
        )}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {fields.map((field, index) => (
        <Input
          defaultValue={defaultInputs[field.name]}
          focus={focus === index}
          key={field.name}
          label={field.label}
          name={field.name}
          onArrowDown={handleNext}
          onArrowUp={handlePrevious}
          onChange={handleInput}
          onEscape={handleEscape}
          onReturn={handleReturn}
          onShiftTab={handlePrevious}
          onTab={handleNext}
          placeholder={defaultInputs[field.name]}
          type={field.type}
          value={String(inputs[field.name])}
        />
      ))}
      {cv3CredentialsFooter}
      {storeFooter}
    </Box>
  );
}

export default init;
