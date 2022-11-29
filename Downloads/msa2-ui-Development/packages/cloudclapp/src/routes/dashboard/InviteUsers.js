import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Dialog from "cloudclapp/src/components/dialog/Dialog";

import {
  getOrganisationName,
} from "cloudclapp/src/store/designations";
import UsersList from "cloudclapp/src/components/users-list/UsersList"

const InviteUsers = ({ onClose }) => {
  const { t } = useTranslation();
  const orgName = useSelector(getOrganisationName);

  return (
    <>
      <Dialog
        id="INVITE_USERS"
        maxWidth="sm"
        onClose={onClose}
        title={t("Users in your organisation", { orgName })}
      >
        <UsersList id={"DASHBOARD"} />
      </Dialog>
    </>
  );
};

export default InviteUsers;
