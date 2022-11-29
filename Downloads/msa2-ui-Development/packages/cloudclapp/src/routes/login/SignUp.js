import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import Validation from "msa2-ui/src/services/Validation";

import {
  Button,
  // Checkbox,
  CircularProgress,
  // FormControlLabel,
  Grid,
  Link,
  Typography,
  makeStyles,
} from "@material-ui/core";

import { EyeIcon, EyeSlashIcon, UserAltIcon } from "react-line-awesome";

import useTogglePassword from "msa2-ui/src/hooks/useTogglePassword";

import { signUp } from "cloudclapp/src/api/user";

import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";

import InputField from "cloudclapp/src/components/controls/InputField";
import CheckboxField from "cloudclapp/src/components/controls/checkbox/CheckboxField";

import VerifyEmail from "cloudclapp/src/routes/login/VerifyEmail";

const SITE_KEY =
  process.env.NODE_ENV === "production"
    ? window.CCLA.keys.a2e94a4b
    : process.env.REACT_APP_CAPTCHA_SITE_KEY;

const licenseAgreementLink =
  process.env.NODE_ENV === "production"
    ? window.CCLA.links.eula
    : process.env.REACT_APP_LICENSE_AGREEMENT_LINK;

const useStyles = makeStyles(({ palette, breakpoints }) => {
  return {
    button: {
      minWidth: 160,
    },
    form: {
      marginTop: 30,
    },
    formItem: {
      display: "flex",
      alignItems: "center",
    },
    groupNameCaption: {
      marginTop: 5,
    },
    link: {
      marginLeft: 3,
      textDecoration: "underline",
    },
    signUpCaption: {
      fontSize: 14,
      maxWidth: 300,
      lineHeight: "20px",
    },
    signUpCheckboxWrapper: {
      width: 300,
    },
    signUpForm: {
      padding: 30,
    },
    signUpUserIcon: {
      color: palette.text.primary,
      fontSize: "48px",
    },
    signUpUserIconBackground: {
      backgroundColor: palette.background.icon,
      borderRadius: 40,
      height: 80,
      width: 80,
    },
    signUpSubTitle: {
      color: palette.text.primary,
      fontWeight: 500,
      fontSize: 18,
      margin: "18px 0",
    },
    signUpText: {
      fontSize: "12px",
      maxWidth: 300,
      lineHeight: "16px",
    },
    signUpTextSecondary: {
      color: "#939EB1",
    },
    textNoWrap: {
      whiteSpace: "nowrap",
    },
    errorText: {
      color: palette.error.main,
    },
  };
});

const User = () => {
  const classes = useStyles();
  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid
        container
        className={classes.signUpUserIconBackground}
        alignItems="center"
        justifyContent="center"
      >
        <UserAltIcon className={classes.signUpUserIcon} />
      </Grid>
    </Grid>
  );
};

const SignUp = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);

  const noCaptchaKey = !SITE_KEY;

  const fields = {
    userMail: {
      label: t("Email Address"),
    },
    userPassword: {
      label: t("Password"),
    },
    confirmPassword: {
      label: t("Confirm Password"),
    },
    groupName: {
      label: t("Group Name"),
    },
    licenseAgreement: {
      label: t("User License Agreement"),
    },
    communicationsAgreement: {},
  };

  const [formData, setFormData] = useState({
    userMail: undefined,
    userPassword: undefined,
    confirmPassword: undefined,
    groupName: undefined,
    licenseAgreement: false,
    communicationsAgreement: false,
  });

  const [formErrors, setFormErrors] = useState(
    noCaptchaKey
      ? {
          signUp: t("Please contact to your System Administrator.", {
            context: t("Cannot create an account."),
            reason: t("No Captcha key found"),
          }),
        }
      : {},
  );

  const [showPassword, PasswordInputAdornment] = useTogglePassword({
    onIcon: EyeIcon,
    offIcon: EyeSlashIcon,
    iconSize: 20,
  });

  const [
    showConfirmPassword,
    ConfirmPasswordInputAdornment,
  ] = useTogglePassword({
    onIcon: EyeIcon,
    offIcon: EyeSlashIcon,
    iconSize: 20,
  });

  useEffect(() => {
    const script = document.createElement("script");
    if (SITE_KEY) {
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      document.body.appendChild(script);

      return () => {
        const badge = document.getElementsByClassName("grecaptcha-badge")[0]
          .parentElement;
        document.body.removeChild(script);
        document.body.removeChild(badge);
      };
    }
  }, []);

  const validationErrors = () => {
    const validateConfirmPassword = (password, confirmPassword) => {
      return (
        (!isEqual(password, confirmPassword) && t("Passwords do not match")) ||
        isUndefined(confirmPassword)
      );
    };

    const validateEmail = (email) => {
      if(isEmpty(email)){
          return t("This field is required.");
      }
      if(!Validation.validEmail(email)){
        return t("Invalid email address");
      }
      return false;
    }

    const errors = {
      ...formErrors,
      userMail: validateEmail(formData.userMail),
      userPassword: isEmpty(formData.userPassword),
      confirmPassword: validateConfirmPassword(
        formData.userPassword,
        formData.confirmPassword,
      ),
      groupName: isEmpty(formData.groupName),
      licenseAgreement:
        Boolean(licenseAgreementLink) &&
        !formData.licenseAgreement &&
        t("You must agree to create an account"),
      signUp: undefined,
    };

    setFormErrors(errors);
    return !Object.values(errors).every((value) => !value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validationErrors()) {
      const action = "validate_captcha";
      window.grecaptcha.ready(() => {
        try {
          window.grecaptcha
            .execute(SITE_KEY, { action })
            .then(async (token) => {
              setIsLoading(true);

              const [error, response] = await signUp({
                action,
                token,
                login: formData.userMail,
                password: formData.userPassword,
                organization: formData.groupName,
              });

              if (error) {
                setFormErrors({
                  ...formErrors,
                  signUp: response?.message,
                });
              } else {
                setIsAccountCreated(true);
              }

              setIsLoading(false);
            });
        } catch ({ message }) {
          setFormErrors({
            ...formErrors,
            signUp: message,
          });
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      return handleSubmit();
    }
  };

  const handleCheckboxChange = ({ target: { checked } }, key) => {
    setFormData({ ...formData, [key]: checked });
    setFormErrors({
      ...formErrors,
      [key]: checked
        ? undefined
        : t("This field is required.", { name: fields[key].label }),
    });
  };

  const handleInputFieldChange = ({ target: { value } }, key) => {
    setFormData({ ...formData, [key]: value });
    setFormErrors({
      ...formErrors,
      [key]: value
        ? undefined
        : t("This field is required.", { name: fields[key].label }),
    });
  };

  if (isAccountCreated) {
    return <VerifyEmail mail={formData.userMail} />;
  }

  return (
    <Grid
      item
      className={classnames(
        classes.signUpForm,
        commonClasses.commonLoginFormWrapper,
      )}
    >
      <User />
      <Typography className={classes.signUpSubTitle}>
        {t("Create an Account")}
      </Typography>
      <Typography variant="caption" className={classes.signUpCaption}>
        {t("Enter your details below to register an account")}
      </Typography>
      <form className={classes.form}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item className={classes.formItem}>
            <InputField
              required
              id="SIGN_UP_EMAIL_INPUT"
              disabled={isLoading || noCaptchaKey}
              autoComplete="username"
              error={formErrors.userMail}
              label={fields.userMail.label}
              value={formData.userMail || ""}
              onChange={(event) => handleInputFieldChange(event, "userMail")}
              onKeyDown={handleKeyDown}
            />
          </Grid>
          <Grid item className={classes.formItem}>
            <InputField
              required
              id="SIGN_UP_PASSWORD_INPUT"
              disabled={isLoading || noCaptchaKey}
              autoComplete="on"
              error={formErrors.userPassword}
              label={fields.userPassword.label}
              value={formData.userPassword || ""}
              onChange={(event) =>
                handleInputFieldChange(event, "userPassword")
              }
              onKeyDown={handleKeyDown}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: <PasswordInputAdornment />,
              }}
            />
          </Grid>
          <Grid item className={classes.formItem}>
            <InputField
              required
              id="SIGN_UP_CONFIRM_PASSWORD_INPUT"
              disabled={isLoading || noCaptchaKey}
              autoComplete="new-password"
              error={formErrors.confirmPassword}
              label={fields.confirmPassword.label}
              value={formData.confirmPassword || ""}
              onChange={(event) =>
                handleInputFieldChange(event, "confirmPassword")
              }
              onKeyDown={handleKeyDown}
              type={showConfirmPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <ConfirmPasswordInputAdornment
                    id={"TOGGLE_SHOW_CONFIRM_PASSWORD"}
                  />
                ),
              }}
            />
          </Grid>
          <Grid container item direction="column" className={classes.formItem}>
            <InputField
              required
              id="SIGN_UP_GROUP_NAME_INPUT"
              disabled={isLoading || noCaptchaKey}
              error={formErrors.groupName}
              label={fields.groupName.label}
              value={formData.groupName || ""}
              onChange={(event) => handleInputFieldChange(event, "groupName")}
              onKeyDown={handleKeyDown}
            />
            <Typography
              align="left"
              className={classnames(
                classes.signUpText,
                classes.groupNameCaption,
                commonClasses.commonTextItalic,
                {
                  [classes.signUpTextSecondary]: !formErrors.groupName,
                },
              )}
              variant="caption"
              color={"textSecondary"}
            >
              {t(
                "A group should be your company or organisation. You must choose a unique name.",
              )}
            </Typography>
          </Grid>
          {licenseAgreementLink && (
            <Grid item className={classes.formItem}>
              <CheckboxField
                id="SIGN_UP_LICENSE_AGREEMENT_CHECKBOX"
                className={classnames(classes.signUpCheckboxWrapper, {
                  [classes.errorText]: formErrors.licenseAgreement,
                })}
                error={formErrors.licenseAgreement}
                disabled={isLoading || noCaptchaKey}
                checked={formData.licenseAgreement}
                onChange={(event) =>
                  handleCheckboxChange(event, "licenseAgreement")
                }
                label={
                  <Typography className={classes.signUpText}>
                    {t("I accept the")}
                    <Link
                      id="SIGN_UP_TERMS_LINK"
                      className={classes.link}
                      color="primary"
                      href={licenseAgreementLink}
                      target="_blank"
                    >
                      {fields.licenseAgreement.label}
                    </Link>
                  </Typography>
                }
              />
            </Grid>
          )}
          {/* <Grid item className={classes.formItem}>
            <Typography
              align="left"
              className={classes.signUpText}
              variant="caption"
            >
              {t(
                "UBiqube is committed to protecting and respecting your privacy, we’ll only use your personal information to administer your account and provide the products and services you requested. From time to time, we would like to contact you about other content that may be of interest to you. If you consent to us contacting you for this purpose, please tick the box below.",
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.formItem}>
            <FormControlLabel
              className={classes.signUpCheckboxWrapper}
              control={
                <Checkbox
                  color="primary"
                  id="SIGN_UP_COMMUNICATIONS_AGREEMENT_CHECKBOX"
                  disabled={isLoading || noCaptchaKey}
                  checked={formData.communicationsAgreement}
                  onChange={({ target: { checked } }) => {
                    setFormData({
                      ...formData,
                      communicationsAgreement: checked,
                    });
                  }}
                />
              }
              label={
                <Typography
                  className={classnames(classes.signUpText, classes.textNoWrap)}
                >
                  {t("I agree to receive other communications from UBiqube.")}
                </Typography>
              }
            />
          </Grid> */}
          <Grid
            item
            container
            direction="column"
            className={classes.formItem}
            spacing={2}
          >
            {formErrors.signUp && (
              <Grid item>
                <Typography
                  align="left"
                  color="error"
                  variant="caption"
                  className={commonClasses.commonTextItalic}
                >
                  {formErrors.signUp}
                </Typography>
              </Grid>
            )}
            <Grid item>
              {isLoading ? (
                <CircularProgress size={36} />
              ) : (
                <Button
                  id="SIGN_UP_CONTINUE_BUTTON"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                >
                  {t("Continue")}
                </Button>
              )}
            </Grid>
            <Grid item>
              <Link
                component={RouterLink}
                id="SIGN_UP_BACK_TO_SIGN_IN_BUTTON"
                color="primary"
                className={classes.button}
                to={{
                  pathname: `/sign-in`,
                }}
              >
                {t("Back to Login")}
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default SignUp;
