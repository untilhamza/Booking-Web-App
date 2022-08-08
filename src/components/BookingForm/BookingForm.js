import React from "react";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import moment from "moment";
import { Form, Button } from "react-bootstrap";
import { DatePicker } from "antd";
import TimeSelector from "../TimeSelector/TimeSelector";

import "./BookingForm.css";

const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;

const schema = yup.object().shape({
  name: yup.string().required("Name is required!"),
  phone: yup.string().min(8, "*Enter a valid phone number").matches(phoneRegex, "*Enter a valid phone number!").required("*Phone number is required!"),
  email: yup.string().email("Must be a valid email").max(255).required("*Email is required!"),
  date: yup.string().required("*Booking date is required!"),
  time: yup.string().required("*Booking time is required!"),
});

const BookingForm = ({ onCancel, onConfirm, oldData, slots, onGetSlots, slotStatus, settings }) => {
  function handleGetSlots(date) {
    onGetSlots(date);
  }

  const disablePastDates = (submittedValue) => {
    if (!submittedValue) {
      return false;
    }
    return submittedValue.valueOf() < moment().add(-1, "day") || submittedValue.valueOf() >= moment().add(31, "day");
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => {
        //submitting data!
        onConfirm(values);
        resetForm();
      }}
      initialValues={{
        name: "",
        phone: "",
        email: "",
        date: moment(),
        time: "",
      }}
    >
      {({ handleSubmit, handleChange, values, touched, isValid, errors, setFieldValue }) => (
        <Form
          noValidate
          //   validated={!errors}
          onSubmit={handleSubmit}
          className="appointmentForm mx-auto p-3 "
        >
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter your name" value={values.name} onChange={handleChange} isValid={touched.name && !errors.name} />
            <div className="text-danger font-italic">
              <ErrorMessage name="name" />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Phone Number</Form.Label>
            <Form.Control type="tel" name="phone" placeholder="Phone number" value={values.phone} onChange={handleChange} isValid={touched.phone && !errors.phone} />
            <div className="text-danger font-italic">
              <ErrorMessage name="phone" />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Email" value={values.email} onChange={handleChange} isValid={touched.email && !errors.email} />
            <div className="text-danger font-italic">
              <ErrorMessage name="email" />
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label className="fw-bold">Date</Form.Label>
            <div>
              <DatePicker
                value={values.date}
                onChange={(enteredMoment) => {
                  handleGetSlots(
                    new moment(enteredMoment).set({
                      hour: 0,
                      minute: 0,
                      second: 0,
                    })
                  );
                  setFieldValue("time", "");
                  setFieldValue("date", enteredMoment.set({ hour: 0, minute: 0, second: 0 }));
                }}
                defaultPickerValue={moment()}
                disabledDate={disablePastDates}
                allowClear={false}
                className="w-100"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label></Form.Label>
            <div>
              <TimeSelector
                choosenDate={values.date}
                time={values.time}
                onChange={(time) => {
                  setFieldValue("time", time);
                }}
                slots={slots}
                loading={slotStatus}
                settings={settings}
              />
            </div>
            <div className="text-danger font-italic">
              <ErrorMessage name="time" />
            </div>
          </Form.Group>

          <div className="d-flex justify-content-around p-2">
            <Button variant="success" type="submit" className="w-100 me-1" disabled={false}>
              Confirm Booking
            </Button>

            <Button variant="danger" type="button" className="w-100 ms-1" onClick={() => onCancel()}>
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BookingForm;
