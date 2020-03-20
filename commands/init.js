import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import fs from "fs";
import moment from "moment";
import { AppContext, Box, Color, Text } from "ink";

import JsonContent from "../src/components/JsonContent";
import TextInput from "../src/components/TextInput";

function loadJSON(path) {
  if (!fs.existsSync(path)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(path));
}

const defaultInputs = {
  username: "",
  password: "",
  id: "",
  stagingURL: "",
  ...loadJSON("./cv3-credentials.json"),
  ...loadJSON("./store.json")
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
      const { username, password, id, stagingURL } = inputs;
      const timestamp = moment().unix();
      const cv3Credentials = { username, password };
      const store = { id, stagingURL, timestamp };
      if (username !== "" && password !== "") {
        fs.writeFileSync(
          "./cv3-credentials.json",
          JSON.stringify(cv3Credentials, null, 2)
        );
      }
      if (id !== "" || stagingURL !== "") {
        fs.writeFileSync("./store.json", JSON.stringify(store, null, 2));
      }
      exit();
    }
  }

  return (
    <Box flexDirection="column">
      {fields.map((field, index) => (
        <TextInput
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
