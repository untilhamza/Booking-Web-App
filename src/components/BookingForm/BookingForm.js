import { useEffect, useState } from "react";
import { Formik, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import Swal from "sweetalert2";
import moment from "moment";
import { Form, Button } from "react-bootstrap";
import { DatePicker } from "antd";
import TimeSelector from "../TimeSelector/TimeSelector";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../database/firebase-config";

import "./BookingForm.css";

const koreanPhoneRegex = /^((\+82))((10\d{7,8})|(2\d{8}))$/;

const schema = yup.object().shape({
  name: yup.string().required("Name is required!"),
  phone: yup.string().min(8, "*Enter a valid phone number").matches(koreanPhoneRegex, "*Enter a valid phone number!").required("*Phone number is required!"),
  email: yup.string().email("Must be a valid email").max(255).required("*Email is required!"),
  date: yup.string().required("*Booking date is required!"),
  time: yup.string().required("*Booking time is required!"),
});

const BookingForm = ({ onCancel, onConfirm, oldData, slots, onGetSlots, slotStatus, settings }) => {
  const [phoneIsVerified, setPhoneIsVerified] = useState(true);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(true);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(null);
  const [phoneVerificationError, setPhoneVerificationError] = useState("");
  const [phoneConfirmationObject, setPhoneConfirmationObject] = useState(null);
  const history = useHistory();

  const handleConfirmButtonClick = () => {
    if (!phoneIsVerified) {
      Swal.fire({
        icon: "info",
        title: "Phone not verified!",
        text: "Please verify your phone number before confirming your booking.",
      });
      return;
    }
  };

  const handlePhoneVerification = async (phoneNumber) => {
    if (!koreanPhoneRegex.test(phoneNumber)) {
      setPhoneVerificationError("Please enter a valid Korean phone number.");
      Swal.fire({
        icon: "info",
        title: "Invalid phone number!",
        text: "Please enter a valid Korean phone number starting with +82.",
      });
      return;
    }
    setIsVerifyingPhone(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      setPhoneConfirmationObject(confirmationResult);
    } catch (err) {
      // history.go(0);
      Swal.fire({
        icon: "error",
        title: "An error occurred!",
        text: "Please refresh the page and try again.",
      });
    }
  };

  function handlePhoneCode(e) {
    e.preventDefault();
    if (!phoneConfirmationObject) {
      //history.go(0);
      Swal.fire({
        icon: "error",
        title: "An error occurred!",
        text: "Please refresh the page and try again.",
      });
      return;
    }
    phoneConfirmationObject
      .confirm(phoneVerificationCode)
      .then((result) => {
        // User signed in successfully with their phone.
        const user = result.user; //not an admin user
        setPhoneIsVerified(true);
        setIsVerifyingPhone(false);
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        setPhoneIsVerified(false);
        setIsVerifyingPhone(false);
        Swal.fire({
          icon: "info",
          title: "Invalid verification code!",
          text: "Please enter a valid verification code sent to your phone.",
        });
      });
  }

  function handleGetSlots(date) {
    onGetSlots(date);
  }

  const disablePastDates = (submittedValue) => {
    if (!submittedValue) {
      return false;
    }
    return submittedValue.valueOf() < moment().add(-1, "day") || submittedValue.valueOf() >= moment().add(31, "day");
  };

  // useEffect(() => {
  //   if (isRecaptchaVerified !== null && !isRecaptchaVerified) {
  //     history.push("/");
  //     return;
  //   }
  // }, [isRecaptchaVerified]);

  // useEffect(() => {
  //   try {
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       "sign-in-button",
  //       {
  //         size: "invisible",
  //         callback: (response) => {
  //           setIsRecaptchaVerified(true);
  //           // reCAPTCHA solved, allow signInWithPhoneNumber.
  //           console.log("reCAPTCHA solved, allow signInWithPhoneNumber.");
  //           //Now handlePhoneVerification(phoneNumber);
  //         },
  //         "expired-callback": () => {
  //           setIsRecaptchaVerified(false);
  //           console.log("reCAPTCHA expired");
  //           // history.go(0);
  //           Swal.fire({
  //             icon: "error",
  //             title: "An error occurred!",
  //             text: "Please refresh the page and try again.",
  //           });
  //         },
  //       },
  //       auth
  //     );

  //     window.recaptchaVerifier.render().then(function (widgetId) {
  //       window.recaptchaWidgetId = widgetId;
  //     });
  //   } catch (e) {
  //     console.log("recapture error", e);
  //   }

  //   return () => {
  //     window.recaptchaVerifier.clear();
  //   };
  // }, []);

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
            if (phoneIsVerified) {
              handleSubmit();
            } else {
            }
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
                // setPhoneNumber("01098999793");
                handleChange(e);
              }}
              isValid={touched.phone && !errors.phone}
            />
            <div className="text-danger font-italic">
              <ErrorMessage name="phone" />
            </div>
            {/* {!phoneIsVerified && !isVerifyingPhone && (
              <Button
                id="sign-in-button"
                onClick={() => {
                  handlePhoneVerification(values.phone);
                }}
                variant="outline-primary"
                className="mt-2 btn-sm"
              >
                Verify phone number!
              </Button>
            )}
            {isVerifyingPhone && !phoneIsVerified && <p className="mb-0">Enter verification code on your phone</p>}
            {phoneIsVerified && !isVerifyingPhone && <p className="text-success ">Your phone was verified successfully! </p>}
            {isVerifyingPhone && (
              <div className="d-flex justify-content-between">
                <input className="form-control form-control-sm w-50" type="text" value={phoneVerificationCode} onChange={(e) => setPhoneVerificationCode(e.target.value)} />
                <button className="btn btn-outline-primary btn-sm w-50 ms-2" onClick={(e) => handlePhoneCode(e)}>
                  Verify code
                </button>
              </div>
            )} */}
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
            <Button
              variant="success"
              type="submit"
              className="w-100 me-1"
              // onClick={() => {
              //   handleConfirmButtonClick();
              // }}
              // disabled={!phoneIsVerified}
            >
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
