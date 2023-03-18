import moment from "moment";
import { combineDateTimeMoment } from "../util/helpers";
import { db } from "../database/firebase-config";
import { collection, addDoc, Timestamp, getDoc, updateDoc, doc, query, where, getDocs, orderBy, runTransaction, deleteDoc, writeBatch, limit } from "firebase/firestore";

const bookingsCollectionRef = collection(db, "bookings");
const slotsCollectionRef = collection(db, "slots");
const settingsCollectionRef = collection(db, "settings");

const API_URL = "";

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

function makeSlotMoment(momentDate, timeString) {
  let timeMoment = moment(timeString, "h:mm a");
  let slotMoment = combineDateTimeMoment(momentDate, timeMoment);
  return slotMoment;
}

async function getSlotsForDay(momentDate, status) {
  const dateMoment = new moment(momentDate);
  let time = new moment().set({ hour: 0, minute: 0, second: 0 });

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
async function deleteRemoteSlot(slotMoment, status) {
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
async function checkSlotNotInDB(slotMoment, status) {
  try {
    const snapQuery = query(
      slotsCollectionRef,
      where("date", ">", Timestamp.fromMillis(slotMoment.clone().subtract(1, "minute").valueOf())),
      where("date", "<", Timestamp.fromMillis(slotMoment.clone().add(1, "minute").valueOf())),
      where("status", "==", status)
    );

    const slotQuerySnap = await getDocs(snapQuery);

    return slotQuerySnap.empty; //it empty is true, the slot is not in the db
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
async function httpGetBooking(id) {
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
}

//get the settings from the db
//TODO: get the latest settings from the collection of settings
async function httpGetSettings() {
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
}

//post new settings to the db
//TODO: just let him add new setting each time and then we fetch the latest ones , so we can see what changes he made
async function httpSubmitSettings(newSettings) {
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
async function httpCheckBooking(phoneNumber) {
  try {
    const yesterdayMoment = new moment().clone().subtract(1, "days");
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
async function httpGetBookings(dateMoment) {
  try {
    dateMoment = new moment(dateMoment);
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
async function httpGetSlots(dateMoment) {
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
async function httpSubmitBlockedSlots(momentDate, localTimesArray) {
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
        if (checkSlotNotInDB(slotMoment, "confirmed")) {
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
async function httpSubmitBooking(bookingData) {
  try {
    return await runTransaction(db, async (transaction) => {
      let bookingTimeMoment = makeSlotMoment(bookingData.date, bookingData.time);

      if (checkSlotNotInDB(bookingTimeMoment, "confirmed")) {
        const slot = {
          date: Timestamp.fromDate(bookingTimeMoment.toDate()),
          status: "confirmed",
        };

        //alert(JSON.stringify({ ...bookingData, ...slot }));

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
async function httpEditBooking(booking) {
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

async function httpCancelBooking(id) {
  try {
    return await runTransaction(db, async (transaction) => {
      //get reference to booking to be deleted
      const bookingDocRef = doc(db, "bookings", id);

      let bookingSnap = await getDoc(bookingDocRef);

      let firebaseTimeStamp = bookingSnap.data().date;
      await deleteRemoteSlot(firebaseTimeStamp, "confirmed");

      //will update the status field on the booking to being updated...
      const newFields = { status: "cancelled" };

      //mark booking as deleted in database
      await updateDoc(bookingDocRef, newFields);

      bookingSnap = await getDoc(bookingDocRef);

      if (bookingSnap.exists()) {
        //delete slot for this booking from blocked and confirmed slot collection
        // let firebaseTimeStamp = bookingSnap.data().date;
        // await deleteRemoteSlot(firebaseTimeStamp, "confirmed");
      } else {
        //TODO: stop transaction....
        throw new Error("The booking you are attempting to cancel was not found!");
      }

      return bookingSnap.data();
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export { httpGetBooking, httpGetBookings, httpGetSlots, httpSubmitBooking, httpEditBooking, httpCancelBooking, httpCheckBooking, httpGetSettings, httpSubmitSettings, httpSubmitBlockedSlots };
