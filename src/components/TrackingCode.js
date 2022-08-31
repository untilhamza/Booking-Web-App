import React from "react";
import { Helmet } from "react-helmet";

const TrackingCode = () => {
  return (
    <Helmet>
      <script>{`var _paq = (window._paq = window._paq || []); /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "https://elkpronetlifyapp.matomo.cloud/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "1"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = "//cdn.matomo.cloud/elkpronetlifyapp.matomo.cloud/matomo.js";
  s.parentNode.insertBefore(g, s);
})();
`}</script>
    </Helmet>
  );
};

export default TrackingCode;
