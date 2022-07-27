import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { BrowserRouter as Router } from "react-router-dom"
import { AuthContextProvider } from "./store/auth-context"
import ScrollToTop from "./components/ScrollToTop.js/ScrollToTop"
import {
  Provider,
  defaultTheme,

} from '@adobe/react-spectrum';



const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <Router>
    <ScrollToTop />
    <AuthContextProvider>
    <Provider colorScheme="light" theme={defaultTheme} >
      <App />
      </Provider>
    </AuthContextProvider>
  </Router>
)
