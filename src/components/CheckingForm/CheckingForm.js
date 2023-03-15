import React from "react";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import "./CheckingForm.css";

const koreanPhoneRegex = /^((\+82))((10\d{7,8})|(2\d{8}))$/;

const CheckingForm = ({ onConfirm, onCancel, initialPhoneNumber }) => {
  const formik = useFormik({
    initialValues: {
      phoneNumber: initialPhoneNumber || "+82",
    },
    validationSchema: yup.object().shape({
      phoneNumber: yup.string().matches(koreanPhoneRegex, { message: "Must be a valid Korean phone number" }).required("*Phone number is required!"),
    }),
    onSubmit: (values) => {
      //const REST_API_URL = "YOUR_REST_API_URL";
      //call method to login here
      onConfirm(values.phoneNumber);

      //alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <>
      <div className="container p-4">
        <div className="card phone-card mx-auto">
          <div className="card-body">
            <h5 className="card-title">Enter Phone Number used to make appointment</h5>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group mb-3">
                <input type="tel" name="phoneNumber" className={"form-control"} placeholder="Phone number" onChange={formik.handleChange} value={formik.values.phoneNumber} />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && <span className="help-block text-danger">{formik.errors.phoneNumber}</span>}
              </div>
              <div className="d-flex justify-content-around ">
                <Button variant="success" type="submit" className="w-100 me-1" disabled={false}>
                  Search
                </Button>

                <Button variant="danger" type="button" className="w-100 ms-1" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckingForm;
