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

    function handleInput(key, value) {
      return { [key]: value === "" || isNaN(value) ? value : value * 1 };
    }

    function handleChange(key, value) {
      setInputs({ ...inputs, ...handleInput(key, value) });
    }

    function handleEscape() {
      exit();
    }

    function handleNext(key, value) {
      setInputs({ ...inputs, ...handleInput(key, value) });
      if (focus < 1) {
        setFocus(focus + 1);
      }
    }

    function handlePrevious(key, value) {
      setInputs({ ...inputs, ...handleInput(key, value) });
      if (focus > 0) {
        setFocus(focus - 1);
      }
    }

    function handleReturn(key, value) {
      handleNext(key, value);
      if (focus === 1) {
        setFocus(2);
        exit();
      }
    }

    return (
      <Box flexDirection="column">
        <JsonContent
          json={inputs}
          label="You already have a file named store.json with the folllowing info:"
          valueColor="red"
        />
        <TextInput
          defaultValue={defaultInputs.id}
          focus={focus === 0}
          label="Store ID:"
          labelColor={focus === 0 ? "magenta" : "white"}
          name="id"
          onArrowDown={handleNext}
          onArrowUp={handlePrevious}
          onChange={handleChange}
          onEscape={handleEscape}
          onReturn={handleReturn}
          onShiftTab={handlePrevious}
          onTab={handleNext}
          placeholder={defaultInputs.id}
          value={String(inputs.id)}
        />
        <TextInput
          defaultValue={defaultInputs.stagingURL}
          focus={focus === 1}
          label="Staging URL:"
          labelColor={focus === 1 ? "magenta" : "white"}
          name="stagingURL"
          onArrowDown={handleNext}
          onArrowUp={handlePrevious}
          onChange={handleChange}
          onEscape={handleEscape}
          onReturn={handleReturn}
          onShiftTab={handlePrevious}
          onTab={handleNext}
          placeholder={defaultInputs.stagingURL}
          value={String(inputs.stagingURL)}
        />
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
