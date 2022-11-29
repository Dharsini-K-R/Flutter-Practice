import React from "react";
import ResourcePropertiesPanel from "./resources";
import InfraPropertiesPanel from "./infra";
import { ENV_DESIGNER } from "../../../Constants";

const PropertiesPanel = ({
  modelerState,
  modelerActions,
  moddle,
  workflows = [],
  readOnly,
  environment,
}) => {
  const { activeElement } = modelerState;
  const { getInputParameterFromElement } = modelerActions;
  const businessObject = getInputParameterFromElement(activeElement);

  switch (businessObject?.type) {
    case ENV_DESIGNER.INFRASTRUCTURES.PROVIDER:
    case ENV_DESIGNER.INFRASTRUCTURES.REGION:
    case ENV_DESIGNER.INFRASTRUCTURES.APP_DEPLOYMENT: {
      return (
        <InfraPropertiesPanel
          environment={environment}
          modelerState={modelerState}
          modelerActions={modelerActions}
          readOnly={readOnly}
          moddle={moddle}
        />
      );
    }
    case ENV_DESIGNER.RESOURCES.K8_CLUSTER: {
      return (
        <ResourcePropertiesPanel
          modelerState={modelerState}
          modelerActions={modelerActions}
          readOnly={readOnly}
          moddle={moddle}
        />
      );
    }

    default:
      return null;
  }
};

export default PropertiesPanel;
