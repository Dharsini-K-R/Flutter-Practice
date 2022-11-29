import React from "react";

import { Paper } from "@material-ui/core";
import UsersList from "cloudclapp/src/components/users-list/UsersList";

const Users = () => {
  return (
    <Paper>
      <UsersList showPermissions />
    </Paper>
  );
};

export default Users;
