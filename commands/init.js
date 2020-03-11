import React, { useState } from "react";
import PropTypes from "prop-types";
import fs from "fs";
import { Box, Color, Text } from "ink";

import FileContent from "../src/components/FileContent";
import TextInput from "../src/components/TextInput";

/// Init CV3 store repo
function init() {
  if (fs.existsSync("./store.json")) {
    const [input, setInput] = useState("");
    const [value, setValue] = useState("");

    const json = JSON.parse(fs.readFileSync("./store.json"));

    function handleCancel(value) {
      setInput("");
      setValue("");
    }

    function handleChange(value) {
      setInput(value);
    }

    function handleSubmit(value) {
      setInput("");
      setValue(value);
    }

    function handleTab(value) {
      setInput("");
      setValue(value);
    }

    return (
      <Box flexDirection="column">
        <FileContent
          file="./store.json"
          label="You already have a file named store.json with the folllowing info:"
        />
        <Box>
          input: <Color keyword="red">{input}</Color>
        </Box>
        <Box>
          value: <Color keyword="blue">{value}</Color>
        </Box>
        <TextInput
          defaultValue="n"
          label="Do you wish to overwrite it?"
          onCancel={handleCancel}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onTab={handleTab}
          placeholder="(y/N)"
          value={input}
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
