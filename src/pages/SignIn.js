import React, { useEffect } from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../store/auth-context";
import LoginForm from "../components/LoginForm";
import SimpleBackdrop from "../components/BackDrop";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import { Modal } from "antd";

const SignIn = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const { status, error, sendRequest } = useHttp(authCtx.onLogin);
  const handleLogin = (values) => {
    sendRequest(values);
  };

  useEffect(() => {
    if (status === STATUS_COMPLETED) {
      //navigate to the see appointment page with the made appointment..
      //may be show some status of the appointment..
      history.push("/admin");
    }
  }, [status, history]);

  function modalError(message) {
    Modal.error({
      title: "An Error occurred",
      content: message ? message : "There was an error",
      // onOk: () => {
      //   history.push("/");
      // },
    });
  }

  if (error) {
    modalError(error);
  }

  return (
    <div>
      <SimpleBackdrop loading={status === STATUS_PENDING} />
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default SignIn;
