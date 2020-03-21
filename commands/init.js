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
  const { exit } = useContext(AppContext);

  const fields = [
    { name: "username", label: "CV3 Username:", type: "text" },
    { name: "password", label: "CV3 Password:", type: "password" },
    { name: "id", label: "Store ID:", type: "number" },
    { name: "stagingURL", label: "Staging URL:", type: "text" }
  ];

  function handleInput(input) {
    setInputs({ ...inputs, ...input });
  }

  function handleEscape() {
    setFocus(fields.length);
    exit();
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
      if (inputs.username !== "" && inputs.password !== "") {
        writeFile(cv3CredentialsPath, {
          username: inputs.username,
          password: inputs.password
        });
      }
      if (inputs.id !== "" || inputs.stagingURL !== "") {
        writeFile(storePath, {
          id: inputs.id,
          stagingURL: inputs.stagingURL,
          timestamp: moment().unix()
        });
      }
      exit();
    }
  }

  function writeFile(path, content) {
    fs.writeFileSync(path, JSON.stringify(content, null, 2));
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
    </Box>
  );
}

export default init;
