import { get, post, destroy } from "msa2-ui/src/api/request";

const API = process.env.REACT_APP_API_PATH;

export const signUp = ({ login, password, organization, token, action }) => {
  return post({
    url: `${API}/ccla/user/register`,
    body: {
      captchaResponse: token,
      action,
      login,
      password,
      organization,
    },
  });
};

export const activate = ({ key }) => {
  return get({
    url: `${API}/ccla/user/activate/${key}`,
  });
};

export const deleteUser = ({ token, id }) => {
  return destroy({
    url: `${API}/user/id/${id}`,
    token,
  });
};

export const deactivateUser = ({ token, id }) => {
  return destroy({
    url: `${API}/ccla/user/deactivate/${id}`,
    token,
  });
};

export const inviteUser = ({ token, email, orgId }) => {
  return post({
    url: `${API}/ccla/user/invite`,
    token,
    body: {
      email,
      orgId,
    },
  });
};
