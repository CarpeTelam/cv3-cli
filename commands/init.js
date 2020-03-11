import React, { useState } from "react";
import PropTypes from "prop-types";
import fs from "fs";
import { Box, Color, Text } from "ink";

import TextInput from "../src/components/TextInput";

/// Init CV3 store repo
function init() {
  if (fs.existsSync("./store.json")) {
    const [query, setQuery] = useState("");
    const [input, setInput] = useState("");

    const store = JSON.parse(fs.readFileSync("./store.json"));

    function handleChange(query) {
      setQuery(query);
    }

    function handleSubmit(input) {
      setQuery("");
      setInput(input);
    }

    return (
      <Box flexDirection="column">
        <Box>
          {"You already have a file named store.json with the folllowing info:"}
        </Box>
        <Box>{"{"}</Box>
        {Object.keys(store).map(function(key, index) {
          return (
            <Box key={key}>
              {`  ${key}: `}
              <Text bold>
                <Color keyword="red">{store[key]}</Color>
              </Text>
            </Box>
          );
        })}
        <Box>{"}"}</Box>
        <Box>
          query: <Color keyword="red">{query}</Color>
        </Box>
        <Box>
          input: <Color keyword="blue">{input}</Color>
        </Box>
        <TextInput
          label="Do you wish to overwrite it?"
          onChange={handleChange}
          onSubmit={handleSubmit}
          placeholder="(y/N)"
          value={query}
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
