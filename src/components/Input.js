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
const SHIFT_TAB = "\u001B[Z";
const TAB = "\x09";

function Input(props) {
  const [cursorOffset, setCursorOffset] = useState((props.value || "").length);
  const [cursorWidth, setCursorWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const { stdin, setRawMode } = useStdin();
  const hasValue = props.value.length > 0;
  const renderedCursorWidth = props.highlightPastedText ? cursorWidth : 0;
  const mask = props.type === "password" ? "*" : props.mask;
  let renderedValue = props.value;
  let renderedPlaceholder = props.placeholder;

  function handleValue(value) {
    const returnValue = value || props.defaultValue;
    return {
      [props.name]:
        props.type === "number" && returnValue !== ""
          ? parseInt(returnValue)
          : returnValue
    };
  }

  useEffect(() => {
    function handleData(data) {
      if (!props.focus || !isMounted) {
        return;
      }
      const string = String(data);
      let value = props.value;
      switch (string) {
        case ARROW_DOWN:
          if (props.onArrowDown) {
            props.onArrowDown(handleValue(value));
          }
          return;
        case ARROW_UP:
          if (props.onArrowUp) {
            props.onArrowUp(handleValue(value));
          }
          return;
        case CTRL_C:
          return;
        case ESCAPE:
          if (props.onEscape) {
            props.onEscape(handleValue(value));
          }
          return;
        case RETURN:
          if (props.onReturn) {
            props.onReturn(handleValue(value));
          }
          return;
        case SHIFT_TAB:
          if (props.onShiftTab) {
            props.onShiftTab(handleValue(value));
          }
          return;
        case TAB:
          if (props.onTab) {
            props.onTab(handleValue(value));
          }
          return;
        case ARROW_LEFT:
          if (props.showCursor && !mask && cursorOffset > 0) {
            setCursorOffset(cursorOffset - 1);
          }
          break;
        case ARROW_RIGHT:
          if (props.showCursor && !mask && cursorOffset < value.length) {
            setCursorOffset(cursorOffset + 1);
          }
          break;
        case BACKSPACE:
        case DELETE:
          if (cursorOffset === 0) {
            break;
          }
          value =
            value.slice(0, cursorOffset - 1) +
            value.slice(cursorOffset, value.length);
          if (cursorOffset > 0) {
            setCursorOffset(cursorOffset - 1);
          }
          break;
        default:
          if (props.type === "number" && isNaN(data)) {
            break;
          }
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
        const returnValue = props.onChange({
          [props.name]:
            props.type === "number" && value !== "" ? parseInt(value) : value
        });
      }
    }

    setIsMounted(true);
    setRawMode(true);
    stdin.addListener("data", handleData);

    return function cleanup() {
      setIsMounted(false);
      stdin.removeListener("data", handleData);
      setRawMode(false);
    };
  });

  if (props.focus && props.showCursor && !mask) {
    renderedValue = props.value.length > 0 ? "" : chalk.bgBlackBright(" ");

    for (let index = 0; index < props.value.length; index++) {
      const char = props.value.charAt(index);
      if (
        index >= cursorOffset - renderedCursorWidth &&
        index <= cursorOffset
      ) {
        renderedValue += chalk.bgBlackBright(char);
      } else {
        renderedValue += char;
      }
    }
  } else if (mask) {
    renderedValue = mask.repeat(props.value.length);
    renderedPlaceholder = mask.repeat(props.placeholder.length);
  }

  if (
    props.focus &&
    props.value.length > 0 &&
    cursorOffset === props.value.length
  ) {
    renderedValue += chalk.bgBlackBright(" ");
  }

  return (
    <Box>
      {props.label && (
        <Box marginRight={1}>
          <Color
            keyword={props.labelColor}
            bold={props.labelBoldOnFocus && props.focus}
          >
            {props.label}
          </Color>
        </Box>
      )}
      {!hasValue && renderedPlaceholder ? (
        <Color keyword={props.placeholderColor}>{renderedPlaceholder}</Color>
      ) : (
        <Color
          keyword={props.inputColor}
          bold={props.valueBoldOnFocus && props.focus}
        >
          {renderedValue}
        </Color>
      )}
    </Box>
  );
}

Input.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  focus: PropTypes.bool,
  highlightPastedText: PropTypes.bool,
  inputColor: PropTypes.string,
  label: PropTypes.string,
  labelBoldOnFocus: PropTypes.bool,
  labelColor: PropTypes.string,
  mask: PropTypes.string,
  name: PropTypes.string.isRequired,
  onArrowDown: PropTypes.func,
  onArrowUp: PropTypes.func,
  onChange: PropTypes.func,
  onEscape: PropTypes.func,
  onReturn: PropTypes.func,
  onShiftTab: PropTypes.func,
  onTab: PropTypes.func,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholderColor: PropTypes.string,
  showCursor: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  valueBoldOnFocus: PropTypes.bool
};

Input.defaultProps = {
  defaultValue: "",
  focus: true,
  highlightPastedText: false,
  inputColor: "blue",
  labelBoldOnFocus: true,
  labelColor: "white",
  placeholder: "",
  placeholderColor: "yellow",
  showCursor: true,
  type: "text",
  valueBoldOnFocus: true
};

export function UncontrolledInput(props) {
  const [value, setValue] = useState("");
  return <Input {...props} value={value} onChange={setValue} />;
}

export default Input;
