import React, { useState } from "react";
import Select from "ink-select-input";

import Clean from "./clean";
import Extract from "./extract";
import Init from "./init";
import Open from "./open";
import Update from "./update";

import { Timestamp } from "../src/components";

/// CV3 CLI tool for local development
function App(props) {
  const commands = [
    { label: "Open Staging URL", value: "open" },
    { label: "Update Templates", value: "update" },
    { label: "Extract Zip", value: "extract" },
    { label: "Clean Repo", value: "clean" },
    { label: "Initialize Repo", value: "init" },
    { label: "Quit", value: "quit" }
  ];

  const handleSelect = ({ value }) => {
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
        setAction(<Timestamp action="Goodbye!" actionColor="magenta" />);
    }
  };

  const defaultAction = <Select items={commands} onSelect={handleSelect} />;
  const [action, setAction] = useState(defaultAction);

  return action;
}

export default App;
