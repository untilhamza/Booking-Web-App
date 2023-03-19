import React, { useState } from "react";
import { auth } from "../database/firebase-config";
import { useHistory } from "react-router-dom";
// import { httpGetSettings } from "../hooks/request"
// import useHttp from "../hooks/useHttp"
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
//describes how the context looks like

const provider = new GoogleAuthProvider();

const ADMINS = ["Nwzxrf32Uee9i6hbTXSN2mWVzlC2", "lHxJifUfgHhJkECibwAudvf3MGp1", "lru8dL4JVWTycq0LHhHgyaWqX133"];

const AuthContext = React.createContext({
  name: "",
  email: "",
  isLoggedIn: false,
  isAdmin: false,
  userId: "",
  user: null,
  onLogin: ({ email, password }) => {},
  onLogout: ({ email, password }) => {},
  onRegister: ({ email, password }) => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const history = useHistory();

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

  const handleCustomerLogin = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        //alert("user logged in" + JSON.stringify(user));
        setUser(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        //TODO: handle customer user login
        history.push("/new-booking");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        alert("error when logging in" + JSON.stringify(error));
        setUser(null);
      });
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
    console.log("user", currentUser);
    setUser(currentUser);
  });
  const contextValue = {
    name: user?.displayname,
    email: user?.email,
    userId: user?.uid,
    isAdmin: user && ADMINS.includes(user?.uid),
    isLoggedIn: user ? true : false,
    user: user,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegister,
    handleCustomerLogin,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
