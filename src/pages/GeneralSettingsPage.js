import { useEffect } from "react"
import GeneralSettings from "../components/Settings/GeneralSettings"
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp"
import { httpGetSettings, httpSubmitSettings } from "../hooks/request"
import SimpleBackdrop from "../components/BackDrop/BackDrop"
import { useHistory } from "react-router-dom"
import ErrorModal from "../components/ErrorModal/ErrorModal"

const GeneralSettingsPage = () => {
  const history = useHistory()
  const {
    status: getSettingsStatus,
    data: settings,
    error: getSettingsErrorMessage,
    sendRequest: getSettings,
  } = useHttp(httpGetSettings)

  const {
    status: submitSettingsStatus,
    data: response,
    error: submitSettingsErrorMessage,
    sendRequest: submitSettings,
  } = useHttp(httpSubmitSettings)

  //need method to fetch the initial values
  //need method to submit edited values

  //fetch the intial values on page loading
  useEffect(() => {
    //fetch the intial values
    getSettings()
  }, [])

  useEffect(() => {
    if (getSettingsStatus === STATUS_COMPLETED) {
      if (getSettingsErrorMessage) {
        ErrorModal({
          message: getSettingsErrorMessage,
          onOk: () => {
            history.push("/")
          },
        })
      } else {
        //reload the page
        history.push("/general-settings")
      }
    }
  }, [getSettingsStatus, history, getSettingsErrorMessage])

  useEffect(() => {
    if (submitSettingsStatus === STATUS_COMPLETED) {
      if (submitSettingsErrorMessage) {
        ErrorModal({
          message: submitSettingsErrorMessage,
          onOk: () => {
            history.push("/")
          },
        })
      }
    }
  }, [submitSettingsStatus, history, submitSettingsErrorMessage])

  const handleOnBack = () => {
    history.goBack()
  }

  const handleOnConfirm = (values) => {
    //send the values to the back end
    submitSettings(values)
  }

  return (
    <>
      <SimpleBackdrop
        loading={
          getSettingsStatus === STATUS_PENDING ||
          submitSettingsStatus === STATUS_PENDING
        }
      />
      {getSettingsStatus === STATUS_COMPLETED && (
        <GeneralSettings
          initialValues={settings}
          onConfirm={handleOnConfirm}
          onCancel={handleOnBack}
        />
      )}
    </>
  )
}

export default GeneralSettingsPage
