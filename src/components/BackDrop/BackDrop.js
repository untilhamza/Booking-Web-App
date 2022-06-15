import * as React from "react"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"

function SimpleBackdrop({ loading }) {
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
  )
}

export default SimpleBackdrop
