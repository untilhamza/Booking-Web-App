import React from "react";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import "./CheckingForm.css";

const CheckingForm = ({ onConfirm, onCancel, initialEmail }) => {
  const formik = useFormik({
    initialValues: {
      email: initialEmail || "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().min(0).email("Must be a valid email").max(255).required("*Email is required!"),
    }),
    onSubmit: (values) => {
      //const REST_API_URL = "YOUR_REST_API_URL";
      //call method to login here
      onConfirm(values.email);

      //alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <>
      <div className="container p-4">
        <div className="card phone-card mx-auto">
          <div className="card-body">
            <h5 className="card-title">Enter email used to make appointment</h5>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group mb-3">
                {/* <label htmlFor="Phone">Phone</label> */}
                <input type="email" name="email" className={"form-control"} placeholder="Email" onChange={formik.handleChange} value={formik.values.email} />
                {formik.touched.phone && formik.errors.phone && <span className="help-block text-danger">{formik.errors.email}</span>}
              </div>
              <div className="d-flex justify-content-around ">
                <Button variant="success" type="submit" className="w-100 me-1" disabled={false}>
                  Confirm
                </Button>

                <Button variant="danger" type="button" className="w-100 ms-1" onClick={onCancel}>
                  Back
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
