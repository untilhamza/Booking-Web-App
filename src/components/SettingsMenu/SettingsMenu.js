import React from "react"
import { useHistory } from "react-router-dom"
import { Button } from "react-bootstrap"

const SettingsMenu = () => {
  const history = useHistory()
  const MENUITEMS = [
    {
      title: "General Shop Settings",
      path: "/general-settings",
    },
    //TODO:  will be done later!
    // {
    //   title: "Slot Settings",
    //   path: "/slot-settings",
    // },
    // {
    //   title: "Special Day Settings",
    //   path: "/general-settings",
    // },
  ]
  return (
    <div className="container p-3  min-vh-100">
      <h2>Settings Menu</h2>
      <div className="vstack gap-2  mx-auto ">
        {MENUITEMS.map((item, index) => (
          <Button
            key={index}
            onClick={() => history.push(item.path)}
            to={item.path}
            type="button"
            variant="outline-secondary"
          >
            {item.title}
          </Button>
        ))}

        <Button
          type="button"
          variant="outline-secondary"
          onClick={history.goBack}
        >
          Back
        </Button>
      </div>
    </div>
  )
}

export default SettingsMenu
