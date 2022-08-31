import React from "react";
import { Helmet } from "react-helmet";

const GoogleAnalytics = () => {
  return (
    <>
      <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-N2D42P9687"></script>
        <script>
          {` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-N2D42P9687');
  `}
        </script>
      </Helmet>
    </>
  );
};

export default GoogleAnalytics;
