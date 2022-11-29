import React from "react";
import ReactMarkdown from "react-markdown";
import { Grid, CircularProgress } from "@material-ui/core";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { useTranslation } from "react-i18next";
import ApplicationDetailsCard from "./ApplicationDetailsCard";
import { getMarketPlaceImagesDetails } from "cloudclapp/src/api/applications";
import useApi from "cloudclapp/src/hooks/useApi";

const ApplicationDetailsModal = ({ onClose, input, width, index }) => {
  const { t } = useTranslation();

  const [loading, , marketplaceDetails, ,] = useApi(
    getMarketPlaceImagesDetails,
    {
     name : input.app_name
    },
  );

  return (
    <Dialog
      id="APPLICATION_DETAILS_MODAL"
      maxWidth="md"
      onClose={onClose}
      title={t("Application Details")}
      data-testid="application-details-dialog"
      textAlignment="left"
    >
      {loading ? (
        <Grid container alignItems="center" justifyContent="center">
          <CircularProgress id="APPLICATION_DETAILS_LOADER" />
        </Grid>
      ) : (
        <>
          <ApplicationDetailsCard
            index={index}
            input={input}
            showDeleteIcon={false}
            width="40%"
          />
          <ReactMarkdown id="APPLICATION_DETAILS_MARKDOWN">
            {marketplaceDetails?.full_description}
          </ReactMarkdown>
        </>
      )}
    </Dialog>
  );
};

export default ApplicationDetailsModal;
