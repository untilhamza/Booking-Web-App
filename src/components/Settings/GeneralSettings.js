import React, { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import ClockPicker from "../ClockPicker/ClockPicker"
import { useFormik } from "formik"
import * as yup from "yup"
import { compareTimes } from "../../util/helpers"
import "./GeneralSettings.css"

const GeneralSettings = ({ onConfirm, onCancel }) => {
  const [pickerTime, setPickerTime] = useState("16:55")
  const [showPicker, setShowPicker] = useState(false)
  const [pickerFunction, setPickerFunction] = useState(() => () => {})
  const [editMode, setEditMode] = useState(false)
  // const [startTime, setStartTime] = useState(null)
  // const [endTime, setEndTime] = useState(null)

  const formik = useFormik({
    initialValues: {
      startTime: "12:45 pm",
      endTime: "07:30 pm",
      slotSize: 45,
      address: "an interesting place on earth",
    },
    validationSchema: yup.object().shape({
      startTime: yup.string().required("Starting time is required!"),
      endTime: yup.string().required("Ending time is required!"),
      slotSize: yup
        .number()
        .min(0, "Minutes must be positive numbers")
        .max(120, "Max slot size is 120 minutes")
        .required("*Slot size is required!"),
      address: yup
        .string()
        .min(8, "address is Too Short!")
        .max(50, "address is Too Long!")
        .required("*Address is required!"),
    }),
    onSubmit: (values) => {
      if (validateTime()) {
        // onConfirm(values)
        console.log("time is valid")
        alert(JSON.stringify(values, null, 2))
      }
    },
  })

  const validateTime = () => {
    const isValid = compareTimes(formik.values.startTime, formik.values.endTime)
    if (!isValid) {
      formik.setFieldError("startTime", "Start time must be before end time")
      formik.setFieldError("endTime", "Start time must be before end time")
    } else {
      formik.setFieldError("startTime", "")
      formik.setFieldError("endTime", "")
    }
    return isValid
  }

  const handleChangeStartTime = (value) => {
    formik.setFieldValue("startTime", value)
    formik.setFieldTouched("startTime")
  }

  const handleChangeEndTime = (value) => {
    formik.setFieldValue("endTime", value)
    formik.setFieldTouched("endTime")
  }

  const handleUsePicker = (setValueFunction, initalValue = null) => {
    setPickerTime(initalValue)
    setPickerFunction(() => setValueFunction)
    setShowPicker(true)
  }

  const handleClosePicker = () => {
    setPickerFunction(() => () => {})
    setPickerTime(null)
    setShowPicker(false)
  }

  return (
    <>
      <ClockPicker
        show={showPicker}
        time={pickerTime}
        onChange={pickerFunction}
        onClose={handleClosePicker}
      />
      <div className="container min-vh-100 p-3">
        <h2>General Shop Settings</h2>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Default Settings</h4>
          <div className="hstack gap-3">
            {editMode ? (
              <>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={formik.handleSubmit}
                >
                  Save
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Back
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="startTime" className="col-4 col-form-label fw-bold">
            Start Time
          </label>
          <div className="col-8 d-flex align-items-center">
            <span>{formik.values.startTime}</span>
            {editMode && (
              <>
                <span
                  className="text-primary fw-light fst-italic ms-3 change-text"
                  onClick={() =>
                    handleUsePicker(
                      handleChangeStartTime,
                      formik.values.startTime
                    )
                  }
                >
                  Change
                </span>
              </>
            )}
          </div>
          {formik.touched.startTime && formik.errors.startTime && (
            <span className="help-block text-danger col-8 offset-4">
              {formik.errors.startTime}
            </span>
          )}
        </div>

        <div className="mb-3 row">
          <label htmlFor="endTime" className="col-4 col-form-label fw-bold">
            End Time
          </label>
          <div className="col-8 d-flex align-items-center">
            <span>{formik.values.endTime}</span>
            {editMode && (
              <span
                className="text-primary fw-light fst-italic ms-3 change-text"
                onClick={() =>
                  handleUsePicker(handleChangeEndTime, formik.values.endTime)
                }
              >
                Change
              </span>
            )}
          </div>
          {formik.touched.endTime && formik.errors.endTime && (
            <span className="help-block text-danger col-8 offset-4">
              {formik.errors.endTime}
            </span>
          )}
        </div>

        <div className="mb-3 row">
          <label htmlFor="slotSize" className="col-4  col-form-label fw-bold">
            Slot Size
          </label>
          <div className="col-8 d-flex align-items-center">
            {editMode ? (
              <input
                type="number"
                className="form-control w-25"
                id="slotSize"
                name="slotSize"
                onChange={formik.handleChange}
                value={formik.values.slotSize}
              />
            ) : (
              <span>45</span>
            )}
            <span className="ms-3">Minutes</span>
          </div>
          {formik.touched.slotSize && formik.errors.slotSize && (
            <span className="help-block text-danger col-8 offset-4">
              {formik.errors.slotSize}
            </span>
          )}
        </div>

        <div className="mb-3 row">
          <label
            htmlFor="inputAddress"
            className="col-4 col-form-label fw-bold"
          >
            Address
          </label>
          <div className="col-8 d-flex align-items-center">
            {editMode ? (
              <textarea
                className="form-control input-address"
                id="inputAddress"
                rows="3"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            ) : (
              <span>{formik.values.address}</span>
            )}
          </div>
          {formik.touched.address && formik.errors.address && (
            <span className="help-block text-danger col-8 offset-4">
              {formik.errors.address}
            </span>
          )}
        </div>
      </div>
    </>
  )
}

export default GeneralSettings
