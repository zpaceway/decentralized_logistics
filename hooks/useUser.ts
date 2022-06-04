import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Location,
  getUserDataByUserId,
  onUserChange,
  UserData,
  Flight,
} from "../firebase";
import Debouncer from "../util/Debouncer";

const debouncer = new Debouncer();

const useUser = () => {
  const [currentUser, setCUrrentUser] = useState(
    <User | undefined | null>undefined
  );
  const [userData, setUserData] = useState(
    <UserData | undefined | null>undefined
  );
  const [userFlights, setUserFlights] = useState(<Flight[]>[]);

  const [userLocations, setUserLocations] = useState<Location[]>([]);

  const refreshUser = async (
    userId: string | null | undefined = currentUser?.uid
  ) => {
    if (userId) {
      const { userData, userLocations, userFlights } =
        await getUserDataByUserId(userId);
      setUserLocations(userLocations);
      setUserData(userData);
      setUserFlights(userFlights);
    }
  };

  useEffect(() => {
    onUserChange((_currentUser) => {
      const onUserChangeHandler = async () => {
        _currentUser !== currentUser && setCUrrentUser(_currentUser);
        if (_currentUser && _currentUser.uid) {
          return refreshUser(_currentUser.uid);
        }
        setUserLocations([]);
        return setUserData(null);
      };
      debouncer.queue(onUserChangeHandler);
    });
  }, []);

  return { currentUser, userData, userLocations, userFlights, refreshUser };
};

export default useUser;
