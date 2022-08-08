import { useReducer, useCallback } from "react";

const SEND = "SEND";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
export const STATUS_PENDING = "PENDING";
export const STATUS_COMPLETED = "COMPLETED";

//TODO: dispatch loading status to redux using the reducer...
function httpReducer(state, action) {
  if (action.type === SEND) {
    return {
      data: null,
      error: null,
      status: STATUS_PENDING,
    };
  }
  if (action.type === SUCCESS) {
    return {
      data: action.responseData,
      error: null,
      status: STATUS_COMPLETED,
    };
  }
  if (action.type === ERROR) {
    return {
      data: null,
      error: action.errorMessage,
      status: STATUS_COMPLETED,
    };
  }
}

function useHttp(requestFunction, startWithPending = false) {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? STATUS_PENDING : null,
    data: null,
    error: null,
  });
  const sendRequest = useCallback(
    //combine all passed args into an array
    async function (...args) {
      dispatch({ type: SEND });
      try {
        //provide all passed args when calling request function
        const response = await requestFunction(...args);
        dispatch({ type: SUCCESS, responseData: response });
      } catch (err) {
        dispatch({
          type: ERROR,
          errorMessage: err.message || "Something went wrong",
        });
      }
    },
    [requestFunction]
  );

  return {
    sendRequest,
    ...httpState,
  };
}

export default useHttp;
