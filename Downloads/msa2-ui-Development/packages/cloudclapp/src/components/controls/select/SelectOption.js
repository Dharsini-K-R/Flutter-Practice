import React from "react";
import { components } from "react-select";
import { Tooltip } from "@material-ui/core";

const SelectOption = (props) => {
  const { data } = props;
  return (
    <Tooltip title={data?.description || ""}>
      <div>
        <components.Option {...props} />
      </div>
    </Tooltip>
  );
};

export default SelectOption;
