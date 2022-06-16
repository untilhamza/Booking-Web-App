import React, { useEffect } from "react"
import BookingForm from "../components/BookingForm/BookingForm"
import { useHistory } from "react-router-dom"
import { Modal } from "antd"
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp"
import { httpSubmitBooking, httpGetSlots } from "../hooks/request"
import SimpleBackdrop from "../components/BackDrop/BackDrop"
import moment from "moment"

const NewBooking = () => {
  //when it is loaded for the first time, we should fetch slots for the current date..
  const history = useHistory()
  const {
    status,
    data: response,
    error,
    sendRequest,
  } = useHttp(httpSubmitBooking)

  const {
    status: slotStatus,
    data: slotsArray,
    sendRequest: sendRequestSlots,
  } = useHttp(httpGetSlots)

  function handleGetSlots(date) {
    sendRequestSlots(date)
  }

  function handleCancel() {
    history.goBack()
  }

  async function handleConfirm(bookingData) {
    sendRequest(bookingData)
  }

  useEffect(() => {
    //TODO: fetch for the date today or the provided date when modifying date

    handleGetSlots(moment())
  }, [])

  useEffect(() => {
    if (status === STATUS_COMPLETED) {
      //navigate to the see appointment page with the made appointment..
      //may be show some status of the appointment..
      history.push(`/appointment/${response}`)
    }
  }, [status, response, history])

  function modalError(message) {
    Modal.error({
      title: "Oops...!!",
      content: message ? message : "An error occurred. Please try again later",
      onOk: () => {
        history.push("/")
      },
    })
  }

  if (error) {
    modalError(error)
  }

  return (
    <div>
      <SimpleBackdrop loading={status === STATUS_PENDING} />
      <BookingForm
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onGetSlots={handleGetSlots}
        slots={slotsArray}
        slotStatus={slotStatus}
      />
    </div>
  )
}

export default NewBooking
