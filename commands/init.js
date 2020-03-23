import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import fs from "fs";
import moment from "moment";
import { AppContext, Box, Color, Text } from "ink";

import Input from "../src/components/Input";

function loadJSON(path) {
  if (!fs.existsSync(path)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(path));
}

const basePath = process.cwd();
const cv3CredentialsPath = `${basePath}/cv3-credentials.json`;
const storePath = `${basePath}/store.json`;

const defaultInputs = {
  username: "",
  password: "",
  id: "",
  stagingURL: "",
  ...loadJSON(cv3CredentialsPath),
  ...loadJSON(storePath)
};

/// Init CV3 store repo
function init() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [focus, setFocus] = useState(0);
  const [cv3CredentialsText, setCv3CredentialsText] = useState("");
  const [storeText, setStoreText] = useState("");
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
      writeConfigs();
    }
  }

  async function writeConfigs() {
    const { username, password, id, stagingURL } = inputs;
    const timestamp = moment().unix();

    const cv3Credentials = JSON.stringify({ username, password }, null, 2);
    const store = JSON.stringify({ id, stagingURL, timestamp }, null, 2);

    const cv3CredentialsPromise =
      username !== "" && password !== ""
        ? fs.promises.writeFile(cv3CredentialsPath, cv3Credentials)
        : Promise.reject(new Error("username or password blank"));

    const storePromise =
      id !== "" || stagingURL !== ""
        ? fs.promises.writeFile(storePath, store)
        : Promise.reject(new Error("id and stagingURL blank"));

    cv3CredentialsPromise
      .then(() => {
        setCv3CredentialsText(
          <>
            <Color blackBright>
              {`${moment().format("YYYY-MM-D HH:mm:ss.SSS")} `}
            </Color>
            <Color keyword="green">{cv3CredentialsPath} updated</Color>
          </>
        );
      })
      .catch(error => {
        setCv3CredentialsText(
          <>
            <Color blackBright>
              {`${moment().format("YYYY-MM-D HH:mm:ss.SSS")} `}
            </Color>
            <Color keyword="yellow">
              {`${cv3CredentialsPath} not updated, `}
            </Color>
            <Color keyword="red">error: {error.message}</Color>
          </>
        );
      });

    storePromise
      .then(() => {
        setStoreText(
          <>
            <Color blackBright>
              {`${moment().format("YYYY-MM-D HH:mm:ss.SSS")} `}
            </Color>
            <Color keyword="green">{storePath} updated</Color>
          </>
        );
      })
      .catch(error => {
        setStoreText(
          <>
            <Color blackBright>
              {`${moment().format("YYYY-MM-D HH:mm:ss.SSS")} `}
            </Color>
            <Color keyword="yellow">{`${storePath} not updated, `}</Color>
            <Color keyword="red">error: {error.message}</Color>
          </>
        );
      })
      .finally(() => exit());
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
      {cv3CredentialsText !== "" && <Box>{cv3CredentialsText}</Box>}
      {storeText !== "" && <Box>{storeText}</Box>}
    </Box>
  );
}

export default init;
