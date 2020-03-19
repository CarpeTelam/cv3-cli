import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import fs from "fs";
import { AppContext, Box, Color, Text } from "ink";

import JsonContent from "../src/components/JsonContent";
import TextInput from "../src/components/TextInput";

const defaultInputs = JSON.parse(fs.readFileSync("./store.json"));

/// Init CV3 store repo
function init() {
  if (fs.existsSync("./store.json")) {
    const [inputs, setInputs] = useState(defaultInputs);
    const [focus, setFocus] = useState(0);
    const { exit } = useContext(AppContext);

    const fields = [
      { name: "id", label: "Store ID:", type: "number" },
      { name: "stagingURL", label: "Staging URL:", type: "text" }
    ];

    function handleInput(key, value) {
      setInputs({ ...inputs, [key]: value });
    }

    function handleEscape() {
      exit();
    }

    function handleNext(key, value) {
      handleInput(key, value);
      if (focus < fields.length - 1) {
        setFocus(focus + 1);
      }
    }

    function handlePrevious(key, value) {
      handleInput(key, value);
      if (focus > 0) {
        setFocus(focus - 1);
      }
    }

    function handleReturn(key, value) {
      handleNext(key, value);
      if (focus === fields.length - 1) {
        setFocus(fields.length);
        exit();
      }
    }

    return (
      <Box flexDirection="column">
        <JsonContent json={inputs} label="store.json:" valueColor="red" />
        {fields.map((field, index) => (
          <TextInput
            defaultValue={defaultInputs[field.name]}
            focus={focus === index}
            key={field.name}
            label={field.label}
            labelColor={focus === index ? "magenta" : "white"}
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
            value={String(inputs[field.name] || "")}
          />
        ))}
      </Box>
    );
  } else {
    return (
      <Box>
        <Text bold>
          <Color keyword="red">File Doesn't Exist</Color>
        </Text>
      </Box>
    );
  }
}

export default init;
