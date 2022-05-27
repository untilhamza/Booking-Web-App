import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useLogin from "../hooks/useLogin";

const SignupForm = () => {
  const { login, isLoginLoading } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Email not valid")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      const REST_API_URL = "YOUR_REST_API_URL";
      //call method to login here
      login(values);
      alert(JSON.stringify(values, null, 2));
    },
  });
  const loginPageStyle = {
    margin: "32px auto 37px",
    maxWidth: "530px",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px 10px rgba(0,0,0,0.15)",
  };
  return (
    <React.Fragment>
      <div className="container">
        <div className="login-wrapper" style={loginPageStyle}>
          <h2>Login Page</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                className={"form-control"}
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {/* {touched.email && errors.email && (
          <span className="help-block text-danger">{errors.email}</span>
        )} */}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                className={"form-control"}
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {/* {touched.password && errors.password && (
          <span className="help-block text-danger">{errors.password}</span>
        )} */}
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-success">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignupForm;
