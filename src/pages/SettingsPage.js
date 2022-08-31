import React from "react";
import GoogleAnalytics from "../components/GoogleAnalytics";
import SettingsMenu from "../components/SettingsMenu/SettingsMenu";
import TrackingCode from "../components/TrackingCode";

const SettingsPage = () => {
  return (
    <div>
      <TrackingCode />
      <GoogleAnalytics />
      <SettingsMenu />
    </div>
  );
};

export default SettingsPage;
