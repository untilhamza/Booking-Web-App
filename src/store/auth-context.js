import React, { useState } from "react";
import { auth } from "../database/firebase-config";
// import { httpGetSettings } from "../hooks/request"
// import useHttp from "../hooks/useHttp"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
//describes how the context looks like
const AuthContext = React.createContext({
  name: "",
  email: "",
  isLoggedIn: false,
  onLogin: ({ email, password }) => {},
  onLogout: ({ email, password }) => {},
  onRegister: ({ email, password }) => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw new Error(err);
      //console.log(err);
    }
  };

  const handleRegister = async ({ email, password }) => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log("error when registering user", err);
      throw new Error(err);
    }
  };

  onAuthStateChanged(auth, (currentUser) => {
    //console.log("checking auth state");
    //TODO: admins should be put in firebase table not here
    const ADMINS = ["Nwzxrf32Uee9i6hbTXSN2mWVzlC2", "lHxJifUfgHhJkECibwAudvf3MGp1", "lru8dL4JVWTycq0LHhHgyaWqX133"];
    if (currentUser && ADMINS.includes(currentUser.uid)) {
      setUser(currentUser);
    } else {
      console.log("User is not admin");
      setUser(null);
    }
  });
  const contextValue = {
    name: user?.displayname,
    email: user?.email,
    isLoggedIn: user ? true : false,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegister,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
