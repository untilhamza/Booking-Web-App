import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import moment from "moment";
import { Form, Button } from "react-bootstrap";
import { DatePicker } from "antd";
import TimeSelector from "../TimeSelector/TimeSelector";

import "./BookingForm.css";

const koreanPhoneRegex = /^((\+82))((10\d{7,8})|(2\d{8}))$/;

const schema = yup.object().shape({
  name: yup.string().required("Name is required!"),
  phone: yup.string().min(8, "*Enter a valid phone number").matches(koreanPhoneRegex, "*Enter a valid phone number!").required("*Phone number is required!"),
  email: yup.string(),
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
        phone: "+82",
        email: "",
        date: moment(),
        time: "",
      }}
    >
      {({ handleSubmit, handleChange, values, touched, isValid, errors, setFieldValue }) => (
        <Form
          noValidate
          //   validated={!errors}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
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
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={values.phone}
              onChange={(e) => {
                const value = e.target.value;
                setFieldValue("phone", value.replace(/[^0-9+]/g, ""));
              }}
              isValid={touched.phone && !errors.phone}
            />
            <div className="text-danger font-italic">
              <ErrorMessage name="phone" />
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
            <Button variant="success" type="submit" className="w-100 me-1">
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
