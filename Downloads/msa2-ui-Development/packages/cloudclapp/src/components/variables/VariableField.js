import React from "react";
import { useSelector } from "react-redux";

import { getToken, getUserDetails } from "cloudclapp/src/store/auth";
import { getOrganisation } from "cloudclapp/src/store/designations";

import MSAVariable from "msa2-ui/src/components/msa-variable";

const VariableField = (props) => {
  const token = useSelector(getToken);
  const userDetails = useSelector(getUserDetails);
  const organisation = useSelector(getOrganisation);

  return (
    <MSAVariable
      {...props}
      storeInfo={{
        token,
        tenant: organisation,
        // subtenant,
        // selectedManagedEntity,
        // subtenants,
        // managedEntities,
        userDetails,
      }}
    />
  );
};

export default VariableField;
