import React from "react";
import { useDispatch, useSelector } from "react-redux";
import OrganisationSelection from "cloudclapp/src/components/organisation-selection/OrganisationSelection";

import { fetchUISettings } from "cloudclapp/src/store/settings";
import {
  setOrganisation,
  getAvailableOrganisations,
  isMultiOrg,
  fetchEnvironmentSummary,
  resetOrganisation,
  fetchConnectionSummary,
  fetchEnvironments,
} from "cloudclapp/src/store/designations";

export const OrgSelection = ({ setAppLoading }) => {
  const dispatch = useDispatch();
  const multiOrg = useSelector(isMultiOrg);
  const tenants = useSelector(getAvailableOrganisations);

  const handleOrganisationSelection = async (_, org) => {
    setAppLoading(true);
    await dispatch(resetOrganisation());
    await dispatch(setOrganisation(org));
    dispatch(fetchEnvironments);
    dispatch(fetchConnectionSummary);
    dispatch(fetchUISettings);
    dispatch(fetchEnvironmentSummary);
    setAppLoading(false);
  };
  return (
    <OrganisationSelection
      tenants={tenants}
      multiOrg={multiOrg}
      onSelectOrganisation={handleOrganisationSelection}
    />
  );
};
