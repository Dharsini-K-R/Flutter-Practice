import React from "react";
import { ENV_DESIGNER } from "cloudclapp/src/Constants";
import K8Cluster from "./K8Cluster";

const Resource = ({ modelerState, modelerActions, moddle, readOnly }) => {
  const { activeElement } = modelerState;
  const { getInputParameterFromElement } = modelerActions;
  const businessObject = getInputParameterFromElement(activeElement);

  const renderElement = () => {
    switch (businessObject?.type) {
      case ENV_DESIGNER.RESOURCES.K8_CLUSTER: {
        return (
          <K8Cluster
            modelerState={modelerState}
            modelerActions={modelerActions}
            readOnly={readOnly}
            moddle={moddle}
          />
        );
      }

      default: {
        return null;
      }
    }
  };
  return renderElement();
};

export default Resource;
