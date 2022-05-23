import moment from "moment";
import db from "../database/firebase-config";
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
} from "firebase/firestore";

const bookingsCollectionRef = collection(db, "bookings");

const API_URL = "";

function processBooking(result) {
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
  };
  return bookingData;
}

// async function delay(data) {
//   return new Promise(function (resolve, reject) {
//     setTimeout(() => {
//       resolve(data);
//     }, 2000);
//   });
// }
//load bookings for given date as json
const httpGetBooking = async (id) => {
  const bookingRef = doc(db, "bookings", id);
  const bookingSnap = await getDoc(bookingRef);

  if (bookingSnap.exists()) {
    // console.log(bookingSnap.data());
    let result = { ...bookingSnap.data(), id: bookingSnap.id };
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
    };

    return bookingData;
  } else {
    return {
      ok: false,
      message: "The appointment was not found!",
    };
  }
};

const httpCheckBooking = async (email) => {
  //const id = phone;
  console.log(email);
  const q = query(
    bookingsCollectionRef,
    where("email", "==", email),
    orderBy("date")
  );

  // const bookingRef = doc(db, "bookings", id);
  //TODO: try using getDoc
  const bookingSnap = await getDocs(q);
  console.log(bookingSnap);

  if (bookingSnap) {
    let result = bookingSnap.docs.map((doc) => ({
      ...processBooking(doc.data()),
      id: doc.id,
    }));
    console.log(result);
    return result[0];
  } else {
    return Promise.reject(Error(`No booking for: ${email}`));
    // return {
    //   ok: false,
    //   message: "Could not find the booking for the email " + email,
    // };
    //throw new Error("The appointment was not found!");
  }
};
//load bookings for given date as json
const httpGetBookings = async (dateMoment) => {
  dateMoment = new moment(dateMoment);
  let queriedDate = dateMoment.format("YYYY-MM-DD").toString();
  let nextDate = dateMoment.add(1, "day").format("YYYY-MM-DD").toString();
  let parsedqueriedDate = Date.parse(queriedDate + "T00:00");
  let parsednextDate = Date.parse(nextDate + "T00:00");
  const q = query(
    bookingsCollectionRef,
    where("date", ">", Timestamp.fromMillis(parsedqueriedDate)),
    where("date", "<", Timestamp.fromMillis(parsednextDate))
  );
  //qeury booking greater than the given date but less the date after....

  const bookingSnap = await getDocs(q);
  if (bookingSnap) {
    let result = bookingSnap.docs.map((doc) => ({
      ...processBooking(doc.data()),
      id: doc.id,
    }));
    console.log(result);
    return result;
  }
  // //console.log(bookingSnap);

  // //format this date here!!!!
  // // setTimeout(() => console.log("got bookings"), 4000);
  // //const response = await fetch(`${API_URL}/bookings/${date}`);
  // //return await response.json();
  // return delay(BOOKINGS);
};

//load already booked time slots for given date as json
const httpGetSlots = async (date) => {
  const response = await fetch(`${API_URL}/slots/${date}`);
  return await response.json();
};

//submit a new booking to the system
const httpSubmitBooking = async (bookingData) => {
  try {
    let bookingMoment = bookingData.date;
    let timeString = bookingData.time;
    let dateString = bookingMoment.format("YYYY-MM-DD").toString();
    let parsedDate = Date.parse(dateString + "T" + timeString);

    const response = await addDoc(bookingsCollectionRef, {
      ...bookingData,
      date: Timestamp.fromMillis(parsedDate),
      dateString,
      status: "confirmed",
    });

    return response.id;
    //pull out the id that was returned here...
  } catch (err) {
    console.log(err);
    return { ok: false };
  }
};

//edit a booking
const httpEditBooking = async (booking) => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "patch",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });
    return response;
  } catch (err) {
    console.log(err);
    return { ok: false };
  }
};

//delete bookings
const httpCancelBooking = async (id) => {
  try {
    const bookingDoc = doc(db, "bookings", id);
    const newFields = { status: "cancelled" };
    const response = await updateDoc(bookingDoc, newFields);
    return response.data();
  } catch (err) {
    console.log(err);
    return { ok: false };
  }
};

//login
const httpLogin = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "post",
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {}
  fetch(`${API_URL}/login`, {
    method: "post",
    body: JSON.stringify(credentials),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        // HANDLE ERROR
        throw new Error("Something went wrong");
      }
    })
    .then((data) => {
      // HANDLE RESPONSE DATA
      console.log(data);
    })
    .catch((error) => {
      // HANDLE ERROR
      console.log(error);
    });
};
export {
  httpGetBooking,
  httpGetBookings,
  httpGetSlots,
  httpSubmitBooking,
  httpEditBooking,
  httpCancelBooking,
  httpLogin,
  httpCheckBooking,
};
