import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Select from "ink-select-input";
import { AppContext } from "ink";

import Clean from "./clean";
import Extract from "./extract";
import Init from "./init";
import Open from "./open";
import Update from "./update";

/// CV3 CLI tool for local development
function App(props) {
  const items = [
    { label: "Open Staging URL", value: "open" },
    // { label: "Update Templates", value: "update" },
    // { label: "Extract Zip", value: "extract" },
    { label: "Clean Repo", value: "clean" },
    { label: "Initialize Repo", value: "init" },
    { label: "Quit", value: "quit" }
  ];
  const defaultAction = <Select items={items} onSelect={handleSelect} />;

  const [action, setAction] = useState(defaultAction);
  const { exit } = useContext(AppContext);

  function handleSelect({ value }) {
    switch (value) {
      case "clean":
        setAction(<Clean />);
        break;
      case "extract":
        setAction(<Extract />);
        break;
      case "init":
        setAction(<Init />);
        break;
      case "open":
        setAction(<Open />);
        break;
      case "update":
        setAction(<Update />);
        break;
      default:
        exit();
        break;
    }
  }

  return action;
}

export default App;
