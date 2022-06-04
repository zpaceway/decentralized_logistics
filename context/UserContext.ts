import { User } from "firebase/auth";
import { createContext } from "react";
import { Flight, Location, UserData } from "../firebase";

const UserContext = createContext({
  currentUser: <User | null | undefined>undefined,
  userData: <UserData | null | undefined>undefined,
  userFlights: <Flight[]>[],
  userLocations: <Location[]>[],
  refreshUser: <any>undefined,
});

export default UserContext;
