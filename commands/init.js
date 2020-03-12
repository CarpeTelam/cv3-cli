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
    const [focus, setFocus] = useState(0);

    function handleChange(value) {
      setInput(value);
    }

    function handleEscape(value) {
      setInput("");
      setValue("");
    }

    function handleReturn(value) {
      setInput("");
      setValue(value);
      if (focus < 3) {
        setFocus(focus + 1);
      }
    }

    function handleShiftTab(value) {
      setInput("");
      setValue(value);
      if (focus > 0) {
        setFocus(focus - 1);
      }
    }

    function handleTab(value) {
      setInput("");
      setValue(value);
      if (focus < 3) {
        setFocus(focus + 1);
      }
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
          focus={focus === 0}
          label="Input 1"
          labelColor={focus === 0 ? "magenta" : "white"}
          onChange={handleChange}
          onEscape={handleEscape}
          onReturn={handleReturn}
          onShiftTab={handleShiftTab}
          onTab={handleTab}
          placeholder="(y/N)"
          value={input}
        />
        <TextInput
          defaultValue="n"
          focus={focus === 1}
          label="Input 2"
          labelColor={focus === 1 ? "magenta" : "white"}
          onChange={handleChange}
          onEscape={handleEscape}
          onReturn={handleReturn}
          onShiftTab={handleShiftTab}
          onTab={handleTab}
          placeholder="(y/N)"
          value={input}
        />
        <TextInput
          defaultValue="n"
          focus={focus === 3}
          label="Input 4"
          labelColor={focus === 3 ? "magenta" : "white"}
          onChange={handleChange}
          onEscape={handleEscape}
          onReturn={handleReturn}
          onShiftTab={handleShiftTab}
          onTab={handleTab}
          placeholder="(y/N)"
          value={input}
        />
        <TextInput
          defaultValue="n"
          focus={focus === 2}
          label="Input 3"
          labelColor={focus === 2 ? "magenta" : "white"}
          onChange={handleChange}
          onEscape={handleEscape}
          onReturn={handleReturn}
          onShiftTab={handleShiftTab}
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
