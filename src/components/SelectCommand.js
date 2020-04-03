import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "ink-select-input";
import { find } from "lodash";

function SelectCommand(props) {
  const handleSelect = ({ value }) => {
    setCommand(find(props.commands, command => command.slug === value).command);
  };

  const defaultCommand = (
    <Select
      items={props.commands.map(command => ({
        label: command.label,
        value: command.slug
      }))}
      onSelect={handleSelect}
    />
  );

  const [command, setCommand] = useState(defaultCommand);

  return command;
}

SelectCommand.propTypes = {
  commands: PropTypes.array.isRequired
};

export default SelectCommand;
