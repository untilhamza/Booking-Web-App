import { v4 as uuidv4 } from "uuid"
import moment from "moment"
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as ImIcons from "react-icons/im"
import * as FiIcons from "react-icons/fi"
import * as BiIcons from "react-icons/bi"

//the slots data is also for a given data => today!!!

const timeSlots = []

var startHour = 10
var startMinute = 30
var duration = 30

var endHour = 19
var endMinute = 30

var startTime = moment().hour(startHour).minute(startMinute).second(0)
var endTime = moment().hour(endHour).minute(endMinute).second(0)

while (startTime <= endTime) {
  timeSlots.push({ time: startTime.clone().format("LT"), id: uuidv4() }) // clone to add new object
  startTime.add(duration, "minutes")
}

//console.log("time slots ", timeSlots)

const sideItems = [
  {
    icon: <AiIcons.AiFillHome />,
    title: "Home",
    path: "/",
    protected: false,
  },
  {
    icon: <ImIcons.ImEnter />,
    title: "Booking",
    path: "/",
    protected: false,
  },

  {
    icon: <FiIcons.FiSettings />,
    title: "Settings",
    path: "/admin",
    protected: true,
  },
  {
    icon: <FaIcons.FaUserShield />,
    title: "Admin",
    path: "/admin",
    protected: false,
  },
  {
    icon: <BiIcons.BiLogOutCircle />,
    title: "Logout",
    path: "/logout",
    protected: true,
  },
]

export { timeSlots as SLOTS, sideItems as SIDEITEMS }
