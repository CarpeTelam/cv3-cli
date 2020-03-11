import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import chalk from "chalk";
import { Box, Color, useStdin } from "ink";

const ARROW_DOWN = "\u001B[B";
const ARROW_LEFT = "\u001B[D";
const ARROW_RIGHT = "\u001B[C";
const ARROW_UP = "\u001B[A";
const BACKSPACE = "\x08";
const CTRL_C = "\x03";
const DELETE = "\x7F";
const ESCAPE = "\x1B";
const RETURN = "\x0D";
const TAB = "\x09";

function TextInput(props) {
  const [cursorOffset, setCursorOffset] = useState((props.value || "").length);
  const [cursorWidth, setCursorWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const { stdin, setRawMode } = useStdin();
  const hasValue = props.value.length > 0;
  const renderedCursorWidth = props.highlightPastedText ? cursorWidth : 0;
  let renderedValue = props.value;

  useEffect(() => {
    function handleInput(data) {
      if (!props.focus || !isMounted) {
        return;
      }
      const string = String(data);
      let value = props.value;
      switch (string) {
        case ARROW_DOWN:
        case ARROW_UP:
        case CTRL_C:
          return;
        case ESCAPE:
          if (props.onCancel) {
            if (value) {
              props.onCancel(value);
            } else if (props.defaultValue) {
              props.onCancel(props.defaultValue);
            }
          }
          return;
        case RETURN:
          if (props.onSubmit) {
            if (value) {
              props.onSubmit(value);
            } else if (props.defaultValue) {
              props.onSubmit(props.defaultValue);
            }
          }
          return;
        case TAB:
          if (props.onTab) {
            if (value) {
              props.onTab(value);
            } else if (props.defaultValue) {
              props.onTab(props.defaultValue);
            }
          }
          return;
        case ARROW_LEFT:
          if (props.showCursor && !props.mask && cursorOffset > 0) {
            setCursorOffset(cursorOffset - 1);
          }
          break;
        case ARROW_RIGHT:
          if (props.showCursor && !props.mask && cursorOffset < value.length) {
            setCursorOffset(cursorOffset + 1);
          }
          break;
        case BACKSPACE:
        case DELETE:
          value =
            value.slice(0, cursorOffset - 1) +
            value.slice(cursorOffset, value.length);
          if (cursorOffset > 0) {
            setCursorOffset(cursorOffset - 1);
          }
          break;
        default:
          value =
            value.slice(0, cursorOffset) +
            string +
            value.slice(cursorOffset, value.length);
          setCursorOffset(cursorOffset + string.length);
          if (string.length > 1) {
            setCursorWidth(string.length);
          }
          break;
      }
      if (cursorOffset < 0) {
        setCursorOffset(0);
      }
      if (cursorOffset > value.length) {
        setCursorOffset(value.length);
      }
      if (value !== props.value && props.onChange) {
        props.onChange(value);
      }
    }

    setIsMounted(true);
    setRawMode(true);
    stdin.addListener("data", handleInput);

    return function cleanup() {
      setIsMounted(false);
      stdin.removeListener("data", handleInput);
      setRawMode(false);
    };
  });

  if (props.showCursor && !props.mask && props.focus) {
    renderedValue = props.value.length > 0 ? "" : chalk.inverse(" ");

    for (let index = 0; index < props.value.length; index++) {
      const char = props.value.charAt(index);
      if (
        index >= cursorOffset - renderedCursorWidth &&
        index <= cursorOffset
      ) {
        renderedValue += chalk.inverse(char);
      } else {
        renderedValue += char;
      }
    }

    if (props.value.length > 0 && cursorOffset === props.value.length) {
      renderedValue += chalk.inverse(" ");
    }
  } else if (props.mask) {
    renderedValue = props.mask.repeat(props.value.length);
  }

  return (
    <Box>
      {props.label && <Box marginRight={1}>{props.label}</Box>}
      {!hasValue && props.placeholder ? (
        <Color keyword={props.placeholderColor}>{props.placeholder}</Color>
      ) : (
        <Color keyword={props.inputColor}>{renderedValue}</Color>
      )}
    </Box>
  );
}

TextInput.propTypes = {
  defaultValue: PropTypes.string,
  focus: PropTypes.bool,
  highlightPastedText: PropTypes.bool,
  inputColor: PropTypes.string,
  label: PropTypes.string,
  mask: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  placeholder: PropTypes.string,
  placeholderColor: PropTypes.string,
  showCursor: PropTypes.bool,
  value: PropTypes.string.isRequired
};

TextInput.defaultProps = {
  focus: true,
  highlightPastedText: false,
  inputColor: "green",
  placeholder: "",
  placeholderColor: "yellow",
  showCursor: true
};

export function UncontrolledTextInput(props) {
  const [value, setValue] = useState("");
  return <TextInput {...props} value={value} onChange={setValue} />;
}

export default TextInput;
