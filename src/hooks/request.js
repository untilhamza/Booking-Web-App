import moment from "moment"
import { combineDateTimeMoment } from "../util/helpers"
import { db } from "../database/firebase-config"
import {
  collection,
  addDoc,
  Timestamp,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  runTransaction,
  deleteDoc,
} from "firebase/firestore"

const bookingsCollectionRef = collection(db, "bookings")
const slotsCollectionRef = collection(db, "slots")
//const settingsCollectionRef = collection(db, "settings")

const API_URL = ""

function processBooking(result) {
  let bookingData = {
    name: result.name,
    phone: result.phone,
    date: result.date.toDate().toDateString(),
    time: moment(result.date.toDate()).format("LT"),
    fb_timeStamp: result.date,
    status: result.status,
  }

  return bookingData
}
function processSlot(result) {
  let slotData = {
    time: moment(result.date.toDate()).format("LT"),
    isBooked: result.status === "confirmed",
    isBlocked: result.isBlocked,
  }
  //console.log(bookingData)
  return slotData
}

//load bookings for given date as json
const httpGetBooking = async (id) => {
  const bookingRef = doc(db, "bookings", id)
  const bookingSnap = await getDoc(bookingRef)

  if (bookingSnap.exists()) {
    // console.log(bookingSnap.data());
    let result = { ...bookingSnap.data(), id: bookingSnap.id }
    let bookingData = {
      name: result.name,
      phone: result.phone,
      date: result.date.toDate().toDateString(),
      time: result.date.toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: result.status,
    }

    return bookingData
  } else {
    return {
      ok: false,
      message: "The appointment was not found!",
    }
  }
}

const httpCheckBooking = async (email) => {
  //const id = phone;
  //console.log(email);
  const q = query(
    bookingsCollectionRef,
    where("email", "==", email),
    orderBy("date", "desc")
  )

  // const bookingRef = doc(db, "bookings", id);
  //TODO: try using getDoc
  const bookingSnap = await getDocs(q)

  if (bookingSnap) {
    let result = bookingSnap.docs.map((doc) => ({
      ...processBooking(doc.data()),
      id: doc.id,
    }))

    return result[0]
  } else {
    return Promise.reject(Error(`No booking for: ${email}`))
  }
}
//load bookings for given date as json
const httpGetBookings = async (dateMoment) => {
  dateMoment = new moment(dateMoment)
  let queriedDate = dateMoment.format("YYYY-MM-DD").toString()
  let nextDate = dateMoment.add(1, "day").format("YYYY-MM-DD").toString()
  let parsedqueriedDate = Date.parse(queriedDate + "T00:00")
  let parsednextDate = Date.parse(nextDate + "T00:00")
  const q = query(
    bookingsCollectionRef,
    where("date", ">", Timestamp.fromMillis(parsedqueriedDate)),
    where("date", "<", Timestamp.fromMillis(parsednextDate))
  )
  //qeury booking greater than the given date but less the date after....

  const bookingSnap = await getDocs(q)
  if (bookingSnap) {
    let result = bookingSnap.docs.map((doc) => ({
      ...processBooking(doc.data()),
      id: doc.id,
    }))
    //console.log(result);
    return result
  }
}

//load already booked time slots for given date as json
const httpGetSlots = async (dateMoment) => {
  dateMoment = new moment(dateMoment)
  let time = new moment().set({ hour: 0, minute: 0, second: 0 })

  let choosenDate = combineDateTimeMoment(dateMoment, time)

  let nextDate = choosenDate.add(1, "day")

  const q = query(
    slotsCollectionRef,
    where("date", ">", Timestamp.fromDate(dateMoment.toDate())),
    where("date", "<", Timestamp.fromDate(nextDate.toDate()))
  )

  const slotSnap = await getDocs(q)

  if (slotSnap) {
    let result = slotSnap.docs.map((doc) => ({
      ...processSlot(doc.data()),
      id: doc.id,
    }))
    return result
  }
}

//submit a new booking to the system
const httpSubmitBooking = async (bookingData) => {
  try {
    return await runTransaction(db, async (transaction) => {
      let timeMoment = moment(bookingData.time, "h:mm a")
      let bookingMoment = combineDateTimeMoment(bookingData.date, timeMoment)

      const slot = {
        date: Timestamp.fromDate(bookingMoment.toDate()),
        status: "confirmed",
      }

      await addDoc(slotsCollectionRef, {
        ...slot,
      })

      const response = await addDoc(bookingsCollectionRef, {
        ...bookingData,
        ...slot,
      })

      //pull out the id that was returned here...
      return response.id
    })
  } catch (err) {
    console.log(err)
    return { ok: false }
  }
}

//edit a booking
const httpEditBooking = async (booking) => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "patch",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    })
    return response
  } catch (err) {
    console.log(err)
    return { ok: false }
  }
}

//delete bookings
const httpCancelBooking = async (id) => {
  try {
    return await runTransaction(db, async (transaction) => {
      const bookingDocRef = doc(db, "bookings", id)

      const newFields = { status: "cancelled" }

      await updateDoc(bookingDocRef, newFields)

      let bookingSnap = await getDoc(bookingDocRef)

      if (bookingSnap.exists()) {
        let firebaseTimeStamp = bookingSnap.data().date

        const q = query(
          slotsCollectionRef,
          where("date", "==", Timestamp.fromDate(firebaseTimeStamp.toDate())),
          where("status", "==", "confirmed")
        )

        const slotSnap = await getDocs(q)

        let slotId = slotSnap.docs[0].id

        let slotRef = doc(slotsCollectionRef, slotId)
        await deleteDoc(slotRef)
      }

      return bookingSnap.data()
    })
  } catch (err) {
    console.log(err)
    return { ok: false }
  }
}

export {
  httpGetBooking,
  httpGetBookings,
  httpGetSlots,
  httpSubmitBooking,
  httpEditBooking,
  httpCancelBooking,
  httpCheckBooking,
}
