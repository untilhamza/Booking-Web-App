import moment, { Moment } from "moment";

import { combineDateTimeMoment } from "../utils/helpers";
import { db } from "../database/firebase-config";
import { collection, addDoc, Timestamp, getDoc, updateDoc, doc, query, where, getDocs, orderBy, runTransaction, deleteDoc, writeBatch, limit } from "firebase/firestore";

const bookingsCollectionRef = collection(db, "bookings");
const slotsCollectionRef = collection(db, "slots");
const settingsCollectionRef = collection(db, "settings");

const API_URL = "";

interface NewBooking {
  email: string;
  googleAccountName: string | null;
  name: string;
  phone: string;
  photoURL: string | null;
  time: string;
  userId: string;
  date: Moment;
}

type BookingStatus = "confirmed" | "blocked" | "cancelled";

function processBooking(result) {
  const isDone = moment(result.date.toDate()) < moment();
  let bookingData = {
    name: result.name,
    phone: result.phone,
    date: result.date.toDate().toDateString(),
    time: moment(result.date.toDate()).format("LT"),
    fb_timeStamp: result.date,
    status: isDone && result.status === "confirmed" ? "completed" : result.status,
    isPast: moment(result.date.toDate()) < moment().subtract("1", "days"),
    id: result.id,
  };

  return bookingData;
}
function processSlot(result) {
  let slotData = {
    time: moment(result.date.toDate()).format("LT"),
    isBooked: result.status === "confirmed",
    isBlocked: result.status === "blocked",
  };
  //console.log(slotData)
  return slotData;
}

async function checkUserAlreadyBookedDay(bookingData: NewBooking): Promise<boolean> {
  const ADMINS = ["Nwzxrf32Uee9i6hbTXSN2mWVzlC2", "lHxJifUfgHhJkECibwAudvf3MGp1", "lru8dL4JVWTycq0LHhHgyaWqX133"];

  // const BLOCKED_USERS = ["lHxJifUfgHhJkECibwAudvf3MGp1", "lru8dL4JVWTycq0LHhHgyaWqX133"];

  if (ADMINS.includes(bookingData.userId)) {
    return true;
  }

  const startOfDay = new Date(bookingData.date.toDate().setHours(0, 0, 0, 0));
  const endOfDay = new Date(bookingData.date.toDate().setHours(23, 59, 59, 999));

  const bookingsQuery = query(
    bookingsCollectionRef,
    where("userId", "==", bookingData.userId),
    where("date", ">=", Timestamp.fromMillis(startOfDay.getTime())),
    where("date", "<=", Timestamp.fromMillis(endOfDay.getTime())),
    where("status", "==", "confirmed")
  );

  const bookingsSnap = await getDocs(bookingsQuery);

  const numberOfBookings = bookingsSnap.size;

  return numberOfBookings <= 1;
}

function makeSlotMoment(momentDate: Moment, timeString) {
  let timeMoment = moment(timeString, "h:mm a");
  let slotMoment = combineDateTimeMoment(momentDate, timeMoment);
  return slotMoment;
}

async function getSlotsForDay(momentDate: Moment, status = null) {
  const dateMoment = moment(momentDate);
  let time = moment().set({ hour: 0, minute: 0, second: 0 });

  let choosenDate = combineDateTimeMoment(dateMoment, time);

  let nextDate = choosenDate.add(1, "day");
  let slotsQuery;
  if (status) {
    slotsQuery = query(slotsCollectionRef, where("date", ">", Timestamp.fromDate(dateMoment.toDate())), where("date", "<", Timestamp.fromDate(nextDate.toDate())), where("status", "==", status));
  } else {
    slotsQuery = query(slotsCollectionRef, where("date", ">", Timestamp.fromDate(dateMoment.toDate())), where("date", "<", Timestamp.fromDate(nextDate.toDate())));
  }
  const slotSnap = await getDocs(slotsQuery);
  return slotSnap;
}

//delete bookings
export async function deleteRemoteSlot(slotMoment: Moment, status: BookingStatus) {
  try {
    const snapQuery = query(slotsCollectionRef, where("date", "==", Timestamp.fromDate(slotMoment.toDate())), where("status", "==", status));

    const slotQuerySnap = await getDocs(snapQuery);

    let slotId = slotQuerySnap.docs[0].id;

    let slotRef = doc(slotsCollectionRef, slotId);

    await deleteDoc(slotRef);
  } catch (err) {
    console.log("delete slot error", err);
    throw err;
  }
}

//tells you that the slot you have choosen is not in the db
export async function checkSlotNotInDB(slotMoment: Moment, status: BookingStatus) {
  try {
    const snapQuery = query(
      slotsCollectionRef,
      where("date", ">", Timestamp.fromMillis(slotMoment.clone().subtract(1, "minute").valueOf())),
      where("date", "<", Timestamp.fromMillis(slotMoment.clone().add(1, "minute").valueOf())),
      where("status", "==", status)
    );

    const slotQuerySnap = await getDocs(snapQuery);

    return slotQuerySnap.empty; //if empty is true, the slot is not in the db
  } catch (err) {
    console.log("error in check slot in db", err);
    throw err;
  }
}

// post a slot to the slot db
async function uploadSlot(slotObject) {
  return await addDoc(slotsCollectionRef, {
    ...slotObject,
  });
}

//load bookings for given date as json
export async function httpGetBooking(id) {
  try {
    const bookingRef = doc(db, "bookings", id);
    const bookingSnap = await getDoc<any>(bookingRef);
    if (bookingSnap.exists()) {
      let result: any = { ...bookingSnap.data(), id: bookingSnap.id };
      let bookingData = processBooking(result);

      return bookingData;
    } else {
      throw new Error("No booking found!");
    }
  } catch (err) {
    throw err;
  }
}

//get the settings from the db
//TODO: get the latest settings from the collection of settings
export async function httpGetSettings() {
  try {
    const settingsSnap = await getDocs(settingsCollectionRef);

    if (settingsSnap) {
      const currentSettings = settingsSnap.docs[0];
      const result = { ...currentSettings.data(), id: currentSettings.id };
      return result;
    } else {
      throw new Error(`No default settings found`);
    }
  } catch (err) {
    throw err;
  }
}

//post new settings to the db
//TODO: just let him add new setting each time and then we fetch the latest ones , so we can see what changes he made
export async function httpSubmitSettings(newSettings) {
  try {
    // const settingsSnap = await getDocs(settingsCollectionRef)
    const settingsDoc = doc(db, "settings", newSettings.id);
    delete newSettings.id;
    await updateDoc(settingsDoc, newSettings); //returns nothing actually
  } catch (err) {
    console.log(err);
    throw err;
  }
}

//returns bookings for an email since yesterday,
//TODO: make a new one that returns all bookings for an email every made ahaha
export async function httpCheckBooking(phoneNumber) {
  try {
    const yesterdayMoment = moment().clone().subtract(1, "days");
    const q = query(bookingsCollectionRef, where("phone", "==", phoneNumber), where("date", ">", Timestamp.fromMillis(yesterdayMoment.valueOf())), orderBy("date", "desc"));

    const bookingQuerySnap = await getDocs(q);

    if (!bookingQuerySnap.empty) {
      let result = bookingQuerySnap.docs.map((doc) => ({
        ...processBooking(doc.data()),
        id: doc.id,
      }));

      return result;
    } else {
      throw new Error(`Found no bookings under ${phoneNumber}`);
    }
  } catch (err) {
    throw err;
  }
}

//load bookings for given date as json
export async function httpGetBookings(dateMoment) {
  try {
    dateMoment = moment(dateMoment);
    let queriedDate = dateMoment.format("YYYY-MM-DD").toString();
    let nextDate = dateMoment.add(1, "day").format("YYYY-MM-DD").toString();
    let parsedqueriedDate = Date.parse(queriedDate + "T00:00");
    let parsednextDate = Date.parse(nextDate + "T00:00");
    const q = query(bookingsCollectionRef, where("date", ">", Timestamp.fromMillis(parsedqueriedDate)), where("date", "<", Timestamp.fromMillis(parsednextDate)));

    const bookingSnap = await getDocs(q);

    if (bookingSnap) {
      let result = bookingSnap.docs.map((doc) => ({
        ...processBooking(doc.data()),
        id: doc.id,
      }));

      return result;
    }
  } catch (err) {
    throw err;
  }
}

//load already booked time slots for given date as json
export async function httpGetSlots(dateMoment) {
  try {
    const slotSnap = await getSlotsForDay(dateMoment);
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
}

//TODO:
//submit an array of slot for  a given day to block and if some slots are not in that day then make sure to unblock them!!!
export async function httpSubmitBlockedSlots(momentDate: Moment, localTimesArray) {
  try {
    return runTransaction(db, async (transaction) => {
      const batch = writeBatch(db); //TODO: use this to delete all and write all slots
      //TODO: delete all blocked slots on given day....
      async function deleteAllSlots(dateMoment, status) {
        const slotSnap = await getSlotsForDay(dateMoment, status);
        if (slotSnap) {
          slotSnap.docs.forEach(async (slot) => {
            await deleteDoc(slot.ref);
          });
        }
      }

      await deleteAllSlots(momentDate, "blocked");

      //TODO: upload new blocked slots...
      for (let localSlotTime of localTimesArray) {
        const slotMoment = makeSlotMoment(momentDate, localSlotTime);
        const isNotBookedOrBlockedSlot = await checkSlotNotInDB(slotMoment, "confirmed");
        if (isNotBookedOrBlockedSlot) {
          //make sure the slot is not already taken
          const slot = {
            date: Timestamp.fromDate(slotMoment.toDate()),
            status: "blocked",
          };

          //use batch to write it...
          //should first check if slot is not already booked...
          await uploadSlot(slot);
        } else {
          //TODO: stop transaction and dont commit batch.. revert all changes.....
          throw new Error("Sorry, cannot block slots that have been booked by a user.");
        }
      }

      //TODO: to be deleted.....
      const slotSnap = await getSlotsForDay(momentDate); //maybe return the new slots and use them to the render teh blocking page...

      let remoteTimesArray;
      if (slotSnap) {
        remoteTimesArray = slotSnap.docs.map((doc) => ({
          ...processSlot(doc.data()),
          id: doc.id,
        }));
        return remoteTimesArray;
      }
    });
  } catch (err) {
    console.log("Error in submitting blocked slots", err); //TODO: use rocketlog or sentry here to report errors that occcur in the app..
    throw err;
  }
}

//submit a new booking to the system
export async function httpSubmitBooking(bookingData) {
  try {
    return await runTransaction(db, async (transaction) => {
      let bookingTimeMoment = makeSlotMoment(bookingData.date, bookingData.time);
      const isNotBookedOrBlockedSlot = await checkSlotNotInDB(bookingTimeMoment, "confirmed");

      // const isUserBlocked = await checkUserBlocked(bookingData.phone);

      const hasNotAlreadyBookedOnDay = await checkUserAlreadyBookedDay(bookingData);

      if (!hasNotAlreadyBookedOnDay) {
        throw new Error("Looks like you have already booked today :).");
      }

      if (isNotBookedOrBlockedSlot) {
        const slot = {
          date: Timestamp.fromDate(bookingTimeMoment.toDate()),
          status: "confirmed",
        };

        const response = await addDoc(bookingsCollectionRef, {
          ...bookingData,
          ...slot,
        });

        await uploadSlot(slot);

        //pull out the id that was returned here...
        return response.id;
      } else {
        throw new Error("Slot is not available. Please choose another slot.");
      }
    });
  } catch (err) {
    throw err;
  }
}

//edit a booking, //NOTE: note being used yet
export async function httpEditBooking(booking) {
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
}

export async function httpCancelBooking(id) {
  try {
    return await runTransaction(db, async (transaction) => {
      //get reference to booking to be deleted
      const bookingDocRef = doc(db, "bookings", id);

      let bookingSnap = await getDoc(bookingDocRef);

      if (!bookingSnap || !bookingSnap.exists()) {
        throw new Error("The booking you are attempting to cancel was not found!");
      }

      let firebaseTimeStamp = bookingSnap.data().date;
      await deleteRemoteSlot(firebaseTimeStamp, "confirmed");

      //will update the status field on the booking to being updated...
      const newFields = { status: "cancelled" };

      //mark booking as deleted in database
      await updateDoc(bookingDocRef, newFields);

      bookingSnap = await getDoc(bookingDocRef);

      return bookingSnap.data();
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}
