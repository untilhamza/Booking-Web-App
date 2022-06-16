import { Modal } from "antd"

const ErrorModal = (errorObject) => {
  return Modal.error({
    title: errorObject?.title ? errorObject.title : "Oops..!!",
    content: errorObject?.message
      ? errorObject?.message
      : "An error occured. Please try again later",
    onOk: errorObject?.onOk,
  })
}

export default ErrorModal
