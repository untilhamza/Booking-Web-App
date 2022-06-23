import React, { useEffect } from "react"
import CheckingForm from "../components/CheckingForm/CheckingForm"
import { useHistory } from "react-router-dom"
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp"
import { httpCheckBooking } from "../hooks/request"
import SimpleBackdrop from "../components/BackDrop/BackDrop"
import ErrorModal from "../components/ErrorModal/ErrorModal"

const CheckAppointment = () => {
  const history = useHistory()
  const {
    status: checkBookingStatus,
    data: response,
    error: errorMessage,
    sendRequest,
  } = useHttp(httpCheckBooking)

  function handleChecking(userEmail) {
    sendRequest(userEmail.email)
  }

  function handleCancel() {
    history.goBack()
  }

  useEffect(() => {
    if (checkBookingStatus === STATUS_COMPLETED) {
      if (errorMessage) {
        ErrorModal({
          message: errorMessage,
          onOk: () => {
            history.push("/")
          },
        })
      } else {
        return history.push(`/appointment/${response.id}`)
      }
    }
  }, [checkBookingStatus, response, history, errorMessage])

  return (
    <div>
      <SimpleBackdrop loading={checkBookingStatus === STATUS_PENDING} />
      <CheckingForm onConfirm={handleChecking} onCancel={handleCancel} />
    </div>
  )
}

export default CheckAppointment
