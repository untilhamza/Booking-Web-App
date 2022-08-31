import React from "react";

const GoogleAnalytics = () => {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-N2D42P9687"></script>
      <script>
        {` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-N2D42P9687');
  `}
      </script>
    </>
  );
};

export default GoogleAnalytics;
