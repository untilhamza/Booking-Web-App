import React from "react"
import TimeKeeper from "react-timekeeper"
import Backdrop from "@mui/material/Backdrop"
import Button from "react-bootstrap/Button"
import "./ClockPicker.css"

const ClockPicker = ({ show, time, onClose, onChange: onChangeTime }) => {
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={show}
        onClick={() => {}}
      >
        <div className="container p-3 min-vh-100 position-relative">
          <div className="d-flex flex-column gap-3 align-items-center mx-auto timer">
            <TimeKeeper
              time={time}
              onChange={(data) => onChangeTime(data.formatted12)}
              doneButton={() => (
                <Button
                  className="d-block w-100 rounded-0"
                  variant="primary"
                  onClick={onClose}
                >
                  Done
                </Button>
              )}
            />
          </div>
        </div>
      </Backdrop>
    </>
  )
}

export default ClockPicker
