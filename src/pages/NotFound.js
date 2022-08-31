import React from "react";
import GoogleAnalytics from "../components/GoogleAnalytics";
import TrackingCode from "../components/TrackingCode";

const NotFound = () => {
  return (
    <>
      <TrackingCode />
      <GoogleAnalytics />
      <div className="text-center">Page Not Found</div>
    </>
  );
};

export default NotFound;
