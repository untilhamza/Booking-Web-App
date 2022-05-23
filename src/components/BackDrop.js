import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import DotLoader from "react-spinners/DotLoader";

function SimpleBackdrop({ loading }) {
  //const [open, setOpen] = React.useState(true);

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  //   const handleToggle = () => {
  //     setOpen(!open);
  //   };

  return (
    <div>
      {/* <Button onClick={handleToggle}>Show backdrop</Button> */}
      <Backdrop
        sx={{ color: "black", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
        {/* <DotLoader loading={loading} size={60} /> */}
      </Backdrop>
    </div>
  );
}

export default SimpleBackdrop;
