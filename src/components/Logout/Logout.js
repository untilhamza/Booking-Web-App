import React from "react"
import { useContext, useEffect, useState } from "react"
import AuthContext from "../../store/auth-context"
import BackDrop from "../BackDrop/BackDrop"
import { useHistory } from "react-router-dom"

const Logout = () => {
  const authCtx = useContext(AuthContext)
  const [showBackDrop, setShowBackDrop] = useState(true)
  const history = useHistory()

  const handleLogout = () => {
    authCtx.onLogout()
  }

  useEffect(() => {
    handleLogout()
    history.replace("/login")
    return () => setShowBackDrop(false)
  }, [])

  return (
    <>
      <BackDrop loading={showBackDrop} />
    </>
  )
}

export default Logout
