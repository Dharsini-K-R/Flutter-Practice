import React from "react";
import { INFRASTRUCTURES } from "../../../../Constants";
import Provider from "./Provider";
import Region from "./Region";
import AppDeployment from "./AppDeployment";

const Infra = ({
  modelerState,
  modelerActions,
  moddle,
  readOnly,
  environment,
}) => {
  const { activeElement } = modelerState;
  const businessObject = modelerActions.getInputParameterFromElement(
    activeElement,
  );

  const renderElement = () => {
    switch (businessObject?.type) {
      case INFRASTRUCTURES.PROVIDER: {
        return (
          <Provider
            modelerState={modelerState}
            modelerActions={modelerActions}
            readOnly={readOnly}
            moddle={moddle}
          />
        );
      }

      case INFRASTRUCTURES.REGION: {
        return (
          <Region
            modelerState={modelerState}
            modelerActions={modelerActions}
            readOnly={readOnly}
            moddle={moddle}
          />
        );
      }
      case INFRASTRUCTURES.APP_DEPLOYMENT: {
        return (
          <AppDeployment
            environment={environment}
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

export default Infra;
