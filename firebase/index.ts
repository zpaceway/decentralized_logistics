import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  query,
  Timestamp,
  where,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCezFEIMSuzrrUomkL1Rng1OcLDVAJxW40",
  authDomain: "decentralizedlogistics-4f4c3.firebaseapp.com",
  projectId: "decentralizedlogistics-4f4c3",
  storageBucket: "decentralizedlogistics-4f4c3.appspot.com",
  messagingSenderId: "310078357547",
  appId: "1:310078357547:web:6e6f734a22820848ee2a6e",
  measurementId: "G-ZNY7FFPYNR",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

interface UserData {
  id?: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  idFileUrl?: string;
}

type LocationType = "consumer" | "keeper";

interface Location {
  id?: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  country: string;
  state: string;
  city: string;
  address: string;
  type: LocationType;
}

interface Flight {
  id?: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  departureDate: Timestamp;
  returnDate: Timestamp;
  returnCountry: string;
  returnState: string;
  returnCity: string;
  returnAddress: string;
  destinations: string[];
  userId: string;
}

interface Request {
  id?: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  departureDate: Timestamp;
  returnDate: Timestamp;
  returnCountry: string;
  returnState: string;
  returnCity: string;
  returnAddress: string;
  destinations: string[];
  userId: string;
}

const createUser = async (
  userData: UserData,
  password: string,

  idFile: any
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    password
  );
  const user = userCredential.user;
  const docRef = doc(collection(db, "users"), user.uid);
  userData.id = user.uid;
  const idFileReference = ref(storage, `users/${user.uid}/idFile.jpg`);
  await uploadBytes(idFileReference, idFile);
  await setDoc(docRef, { userData });
};

const updateUser = async (userId: string, userData: UserData) => {
  const docRef = doc(collection(db, "users"), userId);
  const updatableUserData = {};
  await updateDoc(docRef, { ...updatableUserData, updatedAt: new Date() });
};

const createLocation = async (location: Location) => {
  const { userId } = location;
  const [_, locationDocRef] = await Promise.all([
    updateUser(userId, {} as UserData),
    addDoc(collection(db, "locations"), location),
  ]);
  location.id = locationDocRef.id;
  await updateDoc(locationDocRef, { id: locationDocRef.id });
};

const createFlight = async (flight: Flight) => {
  const { userId } = flight;
  const [_, flightDocRef] = await Promise.all([
    updateUser(userId, {} as UserData),
    addDoc(collection(db, "flights"), flight),
  ]);
  flight.id = flightDocRef.id;
  await updateDoc(flightDocRef, { id: flightDocRef.id });
};

const deleteLocations = async (locations: Location[]) => {
  locations.forEach(async (location) => {
    const { id } = location;
    const locationDocRef = doc(collection(db, "locations"), id);
    await updateDoc(locationDocRef, { active: false });
  });
};

const deleteFlights = async (flights: Flight[]) => {
  flights.forEach(async (flight) => {
    const { id } = flight;
    const flightDocRef = doc(collection(db, "flights"), id);
    await updateDoc(flightDocRef, { active: false });
  });
};

const getActiveKeeperLocations = async () => {
  return (
    await getDocs(
      query(
        collection(db, "locations"),
        where("active", "==", true),
        where("type", "==", "keeper")
      )
    )
  ).docs.map((location) => location.data() as Location);
};

const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

const logout = async () => {
  await signOut(auth);
};

const onUserChange = (callback: ({}: any) => any) => {
  onAuthStateChanged(auth, (user) => callback(user));
};

const getUserDataByUserId = async (userId: string) => {
  const userDataDoc = await getDoc(doc(collection(db, "users"), userId));
  const userLocations = (
    await getDocs(
      query(
        collection(db, "locations"),
        where("userId", "==", userId),
        where("active", "==", true)
      )
    )
  ).docs.map((location) => location.data() as Location);
  const userFlights = (
    await getDocs(
      query(
        collection(db, "flights"),
        where("userId", "==", userId),
        where("active", "==", true)
      )
    )
  ).docs.map((flight) => flight.data() as Flight);
  const userData = userDataDoc.data() as UserData;
  userData.idFileUrl = await getDownloadURL(
    ref(storage, `users/${userId}/idFile.jpg`)
  );
  return { userData, userLocations, userFlights };
};

export {
  onUserChange,
  createUser,
  login,
  logout,
  getUserDataByUserId,
  updateUser,
  createFlight,
  createLocation,
  deleteLocations,
  deleteFlights,
  getActiveKeeperLocations,
};

export type { UserData, Location, LocationType, Flight };
