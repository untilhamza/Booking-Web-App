import moment from "moment";
import { combineDateTimeMoment } from "../util/helpers";
import { db } from "../database/firebase-config";
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
  limit,
} from "firebase/firestore";

const bookingsCollectionRef = collection(db, "bookings");
const slotsCollectionRef = collection(db, "slots");
const settingsCollectionRef = collection(db, "settings");

const API_URL = "";

function processBooking(result) {
  console.log(result);
  const isDone = moment(result.date.toDate()) < moment();
  let bookingData = {
    name: result.name,
    phone: result.phone,
    date: result.date.toDate().toDateString(),
    time: moment(result.date.toDate()).format("LT"),
    fb_timeStamp: result.date,
    status:
      isDone && result.status === "confirmed" ? "completed" : result.status,
    isPast: moment(result.date.toDate()) < moment().subtract("1", "days"),
  };

  return bookingData;
}
function processSlot(result) {
  let slotData = {
    time: moment(result.date.toDate()).format("LT"),
    isBooked: result.status === "confirmed",
    isBlocked: result.isBlocked,
  };
  //console.log(slotData)
  return slotData;
}

//load bookings for given date as json
const httpGetBooking = async (id) => {
  try {
    const bookingRef = doc(db, "bookings", id);
    const bookingSnap = await getDoc(bookingRef);

    if (bookingSnap.exists()) {
      let result = { ...bookingSnap.data(), id: bookingSnap.id };
      let bookingData = processBooking(result);

      return bookingData;
    } else {
      throw new Error("No booking found!");
    }
  } catch (err) {
    throw err;
  }
};

//get the settings from the db
const httpGetSettings = async () => {
  try {
    const settingsSnap = await getDocs(settingsCollectionRef);

    if (settingsSnap) {
      let result = settingsSnap.docs[0];
      result = { ...result.data(), id: result.id };
      return result;
    } else {
      throw new Error(`No default settings found`);
    }
  } catch (err) {
    throw err;
  }
};

//post new settings to the db
const httpSubmitSettings = async (newSettings) => {
  try {
    // const settingsSnap = await getDocs(settingsCollectionRef)
    const settingsDoc = doc(db, "settings", newSettings.id);
    delete newSettings.id;
    await updateDoc(settingsDoc, newSettings); //returns nothing actually
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const httpCheckBooking = async (email) => {
  try {
    const yesterdayMoment = new moment().clone().subtract(1, "days");
    const q = query(
      bookingsCollectionRef,
      where("email", "==", email),
      where("date", ">", Timestamp.fromMillis(yesterdayMoment.valueOf())),
      orderBy("date", "desc")
    );

    // const bookingRef = doc(db, "bookings", id);
    //TODO: try using getDoc
    const bookingQuerySnap = await getDocs(q);

    if (!bookingQuerySnap.empty) {
      let result = bookingQuerySnap.docs.map((doc) => ({
        ...processBooking(doc.data()),
        id: doc.id,
      }));
      console.log(result);
      return result[0];
    } else {
      throw new Error(`Found no bookings under  ${email}`);
    }
  } catch (err) {
    throw err;
  }
};
//load bookings for given date as json
const httpGetBookings = async (dateMoment) => {
  try {
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
      //console.log(result);
      return result;
    }
  } catch (err) {
    throw err;
  }
};

//load already booked time slots for given date as json
const httpGetSlots = async (dateMoment) => {
  try {
    dateMoment = new moment(dateMoment);
    let time = new moment().set({ hour: 0, minute: 0, second: 0 });

    let choosenDate = combineDateTimeMoment(dateMoment, time);

    let nextDate = choosenDate.add(1, "day");

    const q = query(
      slotsCollectionRef,
      where("date", ">", Timestamp.fromDate(dateMoment.toDate())),
      where("date", "<", Timestamp.fromDate(nextDate.toDate()))
    );

    const slotSnap = await getDocs(q);

    if (slotSnap) {
      let result = slotSnap.docs.map((doc) => ({
        ...processSlot(doc.data()),
        id: doc.id,
      }));
      return result;
    }
  } catch (err) {
    throw err;
  }
};

//TODO:
//submit an array of slot for  a given day to block and if some slots are not in that day then make sure to unblock them!!!
const httpSubmitBlockedSlots = async () => {
  //TODO: sync the array you have with teh slots in the db
  // - remove those taht have been freed... just delete them.. (you already have a function to delete slots...)
  // add those that have been blocked
  try {
  } catch (err) {
    throw err;
  }
};

//submit a new booking to the system
const httpSubmitBooking = async (bookingData) => {
  try {
    return await runTransaction(db, async (transaction) => {
      let timeMoment = moment(bookingData.time, "h:mm a");
      let bookingMoment = combineDateTimeMoment(bookingData.date, timeMoment);

      //TODO: make sure slot is not already taken...
      const snapQuery = query(
        slotsCollectionRef,
        where(
          "date",
          ">",
          Timestamp.fromMillis(
            bookingMoment.clone().subtract(1, "minute").valueOf()
          )
        ),
        where(
          "date",
          "<",
          Timestamp.fromMillis(bookingMoment.clone().add(1, "minute").valueOf())
        ),
        where("status", "==", "confirmed")
      );

      const slotQuerySnap = await getDocs(snapQuery);

      if (!slotQuerySnap.empty) {
        throw new Error("Slot is not available. Please choose another slot.");
      }

      const slot = {
        date: Timestamp.fromDate(bookingMoment.toDate()),
        status: "confirmed",
      };

      await addDoc(slotsCollectionRef, {
        ...slot,
      });

      const response = await addDoc(bookingsCollectionRef, {
        ...bookingData,
        ...slot,
      });

      //pull out the id that was returned here...
      return response.id;
    });
  } catch (err) {
    throw err;
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
    throw err;
  }
};

//delete bookings
const httpCancelBooking = async (id) => {
  try {
    return await runTransaction(db, async (transaction) => {
      const bookingDocRef = doc(db, "bookings", id);

      const newFields = { status: "cancelled" };

      await updateDoc(bookingDocRef, newFields);

      let bookingSnap = await getDoc(bookingDocRef);

      if (bookingSnap.exists()) {
        let firebaseTimeStamp = bookingSnap.data().date;

        const snapQuery = query(
          slotsCollectionRef,
          where("date", "==", Timestamp.fromDate(firebaseTimeStamp.toDate())),
          where("status", "==", "confirmed")
        );

        const slotQuerySnap = await getDocs(snapQuery);

        let slotId = slotQuerySnap.docs[0].id;

        let slotRef = doc(slotsCollectionRef, slotId);
        await deleteDoc(slotRef);
      } else {
        throw new Error(
          "The booking you are attempting to cancel was not found!"
        );
      }

      return bookingSnap.data();
    });
  } catch (err) {
    throw err;
  }
};

export {
  httpGetBooking,
  httpGetBookings,
  httpGetSlots,
  httpSubmitBooking,
  httpEditBooking,
  httpCancelBooking,
  httpCheckBooking,
  httpGetSettings,
  httpSubmitSettings,
  httpSubmitBlockedSlots,
};
