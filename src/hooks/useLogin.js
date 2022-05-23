import { useState } from "react";
import { httpLogin } from "./request";

const useLogin = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const login = async (credentials) => {
    setIsLoginLoading(true);
    httpLogin(credentials);
    setIsLoginLoading(false);
  };
  return { isLoginLoading, login };
};

export default useLogin;
