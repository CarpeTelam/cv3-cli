import React, { useState } from "react";

import Clean from "./clean";
import Extract from "./extract";
import Init from "./init";
import Open from "./open";
import Update from "./update";

import { SelectCommand, Timestamp } from "../src/components";

/// CV3 CLI tool for local development
function App(props) {
  const commands = [
    {
      command: <Open />,
      label: "Open Staging URL (open)",
      slug: "open"
    },
    {
      command: <Update />,
      label: "Update Templates (update)",
      slug: "update"
    },
    {
      command: <Extract />,
      label: "Extract Zip (extract)",
      slug: "extract"
    },
    {
      command: <Clean />,
      label: "Clean Repo (clean)",
      slug: "clean"
    },
    {
      command: <Init />,
      label: "Initialize Repo (init)",
      slug: "init"
    },
    {
      command: <Timestamp action="Goodbye!" actionColor="magenta" />,
      label: "Quit",
      slug: "quit"
    }
  ];

  return <SelectCommand commands={commands} />;
}

export default App;
