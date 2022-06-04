import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../../styles/Global.module.scss";
import Drawer from "../../../components/Drawer";
import { useContext, useEffect, useReducer, useState } from "react";
import UserContext from "../../../context/UserContext";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  Box,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  OutlinedInput,
  Chip,
} from "@mui/material";
import {
  Location,
  LocationType,
  createLocation,
  deleteLocations,
  deleteFlights,
  getActiveKeeperLocations,
  createFlight,
  Flight,
} from "../../../firebase";
import Modal from "../../../components/Modal";
import { Timestamp } from "firebase/firestore";
import {
  AccountCircle,
  AddCircle,
  AddLocationAlt,
  AirplaneTicket,
  CalendarMonth,
  DeleteForever,
  FmdGood,
  LocationOn,
  ShoppingCart,
  Storefront,
} from "@mui/icons-material";
import { format } from "date-fns";

const Account: NextPage = () => {
  const [isNewLocationModalOpened, setIsNewLocationModalOpened] =
    useState(false);
  const [isNewFlightModalOpened, setIsNewFlightModalOpened] = useState(false);
  const [newLocationType, setNewLocationType] =
    useState<LocationType>("consumer");
  const [newLocationCountry, setNewLocationCountry] = useState("");
  const [newLocationState, setNewLocationState] = useState("");
  const [newLocationCity, setNewLocationCity] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");
  const [newFlightDepartureDate, setNewFlightDepartureDate] = useState(
    new Date()
  );
  const [newFlightReturnDate, setNewFlightReturnDate] = useState(new Date());

  const [delConsumerLocations, setDelConsumerLocations] = useState<Location[]>(
    []
  );
  const [delFlights, setDelFlights] = useState<Flight[]>([]);

  const [delKeeperLocations, setDelKeeperLocations] = useState<Location[]>([]);
  const [activeKeeperLocations, setActiveKeeperLocations] = useState<
    Location[]
  >([]);

  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);

  const user = useContext(UserContext);

  const cleanNewLocationFields = () => {
    setNewLocationCountry("");
    setNewLocationState("");
    setNewLocationCity("");
    setNewLocationAddress("");
    setSelectedLocationIds([]);
  };

  const deleteLocationsHandler = async (type: LocationType) => {
    if (type === "consumer") {
      deleteLocations(delConsumerLocations);
    } else {
      deleteLocations(delKeeperLocations);
    }
    await user.refreshUser();
    if (type === "consumer") {
      setDelConsumerLocations([]);
    } else {
      setDelKeeperLocations([]);
    }
  };

  const deleteFlightsHandler = async () => {
    deleteFlights(delFlights);
    await user.refreshUser();
    setDelFlights([]);
  };

  useEffect(() => {
    const handler = async () => {
      setActiveKeeperLocations(await getActiveKeeperLocations());
    };
    handler();
  }, [isNewFlightModalOpened]);

  return (
    <div>
      {(isNewLocationModalOpened || isNewFlightModalOpened) && (
        <Modal
          onClose={() => {
            setIsNewLocationModalOpened(false);
            setIsNewFlightModalOpened(false);
          }}
        >
          <FormControl fullWidth>
            <Typography variant="h2" component="h2" fontWeight={900}>
              <Box height="60px" marginBottom="24px">
                CARGO
              </Box>
            </Typography>
            {isNewFlightModalOpened && (
              <>
                <TextField
                  label="Departure"
                  variant="outlined"
                  style={{ margin: "6px" }}
                  type="date"
                  onChange={(e) =>
                    setNewFlightDepartureDate(new Date(e.target.value))
                  }
                  value={format(newFlightDepartureDate, "yyyy-MM-dd")}
                />
                <TextField
                  label="Return"
                  variant="outlined"
                  style={{ margin: "6px" }}
                  type="date"
                  onChange={(e) =>
                    setNewFlightReturnDate(new Date(e.target.value))
                  }
                  value={format(newFlightReturnDate, "yyyy-MM-dd")}
                />
                <Box
                  position="relative"
                  width="100%"
                  boxSizing="border-box"
                  padding="0 6px"
                  margin="6px 0"
                >
                  <InputLabel id="demo-multiple-chip-label">
                    Locations
                  </InputLabel>
                  <Select
                    style={{
                      width: "100%",
                    }}
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selectedLocationIds}
                    onChange={(e) => {
                      setSelectedLocationIds(e.target.value as string[]);
                    }}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value: string) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {activeKeeperLocations.map((location) => (
                      <MenuItem value={location.id!} key={location.id}>
                        {location.country} / {location.state} / {location.city}
                        {" / "}
                        {location.address}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </>
            )}
            {isNewFlightModalOpened && (
              <span style={{ padding: "12px 12px" }}>Final destination</span>
            )}
            <TextField
              label="Country"
              variant="outlined"
              style={{ margin: "6px" }}
              value={newLocationCountry}
              onChange={(e) => setNewLocationCountry(e.target.value)}
            />
            <TextField
              label="State"
              variant="outlined"
              style={{ margin: "6px" }}
              value={newLocationState}
              onChange={(e) => setNewLocationState(e.target.value)}
            />
            <TextField
              label="City"
              variant="outlined"
              style={{ margin: "6px" }}
              value={newLocationCity}
              onChange={(e) => setNewLocationCity(e.target.value)}
            />
            <TextField
              label="Address"
              variant="outlined"
              style={{ margin: "6px" }}
              value={newLocationAddress}
              onChange={(e) => setNewLocationAddress(e.target.value)}
            />
            <Box
              display="flex"
              justifyContent="flex-end"
              gap="8px"
              style={{
                boxSizing: "border-box",
                margin: "6px",
              }}
            >
              <Button
                variant="contained"
                onClick={async () => {
                  const now = Timestamp.fromDate(new Date());
                  if (isNewLocationModalOpened) {
                    const newLocation = {
                      active: true,
                      createdAt: now,
                      updatedAt: now,
                      userId: user.currentUser!.uid,
                      country: newLocationCountry,
                      state: newLocationState,
                      city: newLocationCity,
                      address: newLocationAddress,
                      type: newLocationType,
                    };
                    await createLocation(newLocation);
                    user.userLocations.push(newLocation);
                  } else {
                    const newFlight = {
                      active: true,
                      createdAt: now,
                      updatedAt: now,
                      departureDate: Timestamp.fromDate(newFlightDepartureDate),
                      returnDate: Timestamp.fromDate(newFlightReturnDate),
                      returnCountry: newLocationCountry,
                      returnState: newLocationState,
                      returnCity: newLocationCity,
                      returnAddress: newLocationAddress,
                      destinations: selectedLocationIds,
                      userId: user.currentUser!.uid,
                      type: newLocationType,
                    };
                    await createFlight(newFlight);
                    user.userFlights.push(newFlight);
                  }
                  setIsNewLocationModalOpened(false);
                  setIsNewFlightModalOpened(false);
                }}
              >
                Create
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setIsNewLocationModalOpened(false);
                  setIsNewFlightModalOpened(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          </FormControl>
        </Modal>
      )}
      <Head>
        <title>CARGO</title>
        <meta name="description" content="DLA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Drawer>
        {user.userData && user.currentUser && (
          <div className={styles.dashboard}>
            <div className={styles.settingsContainer}>
              <div className={styles.banner}>
                PROFILE <AccountCircle />
              </div>
              <div className={styles.profile}>
                <div className={styles.bubble}>
                  {user.userData.firstName.charAt(0)}
                </div>
                <div className={styles.name}>
                  <Typography variant="h6" noWrap component="div">
                    {user.userData.firstName} {user.userData.lastName}
                  </Typography>
                  <Typography variant="caption" noWrap component="div">
                    {user.userData.email}
                  </Typography>
                </div>
              </div>
              <TableContainer className={styles.userTable} component={Paper}>
                <Table sx={{ width: "100%" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        User ID
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        {user.currentUser.uid}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Status
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        <Button
                          variant="contained"
                          color={user.userData.active ? "primary" : "error"}
                        >
                          {user.userData.active ? "Active" : "Inactive"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Member since
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        {user.userData.createdAt.toDate().toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Last update
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        {user.userData.updatedAt.toDate().toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        First Name
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        {user.userData.firstName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Last Name
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        {user.userData.lastName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        ID File
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        <Button
                          variant="contained"
                          onClick={() =>
                            window.open(user.userData?.idFileUrl, "blank")
                          }
                        >
                          Open File
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Email
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        {user.userData.email}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className={styles.settingsContainer}>
              <div className={styles.banner}>
                CONSUMER <ShoppingCart />
              </div>
              <TableContainer className={styles.userTable} component={Paper}>
                <Table sx={{ width: "100%" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Button
                          variant="contained"
                          onClick={() => {
                            cleanNewLocationFields();
                            setNewLocationType("consumer");
                            setIsNewLocationModalOpened(true);
                          }}
                        >
                          <AddLocationAlt />
                        </Button>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          disabled={!delConsumerLocations.length}
                          onClick={() => deleteLocationsHandler("consumer")}
                        >
                          <DeleteForever />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {user.userLocations
                      .filter((location) => location.type === "consumer")
                      .map((location) => (
                        <TableRow key={location.id}>
                          <TableCell component="th" scope="row">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const locationId = location.id;
                                if (isChecked) {
                                  return setDelConsumerLocations([
                                    ...delConsumerLocations,
                                    location,
                                  ]);
                                }
                                return setDelConsumerLocations(
                                  delConsumerLocations.filter(
                                    (_location) => _location.id != locationId
                                  )
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ minWidth: "160px", wordBreak: "break-all" }}
                          >
                            <Box
                              display="flex"
                              justifyContent="flex-end"
                              alignItems="center"
                            >
                              {location.country} / {location.state} /{" "}
                              {location.city}
                              {" / "}
                              {location.address}
                              <LocationOn />
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className={styles.settingsContainer}>
              <div className={styles.banner}>
                KEEPER <Storefront />
              </div>
              <TableContainer className={styles.userTable} component={Paper}>
                <Table sx={{ width: "100%" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Button
                          variant="contained"
                          onClick={() => {
                            cleanNewLocationFields();
                            setNewLocationType("keeper");
                            setIsNewLocationModalOpened(true);
                          }}
                        >
                          <AddLocationAlt />
                        </Button>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          disabled={!delKeeperLocations.length}
                          onClick={() => deleteLocationsHandler("keeper")}
                        >
                          <DeleteForever />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {user.userLocations
                      .filter((location) => location.type === "keeper")
                      .map((location) => (
                        <TableRow key={location.id}>
                          <TableCell component="th" scope="row">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const locationId = location.id;
                                if (isChecked) {
                                  return setDelKeeperLocations([
                                    ...delKeeperLocations,
                                    location,
                                  ]);
                                }
                                return setDelKeeperLocations(
                                  delKeeperLocations.filter(
                                    (_location) => _location.id != locationId
                                  )
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ minWidth: "160px", wordBreak: "break-all" }}
                          >
                            <Box
                              display="flex"
                              justifyContent="flex-end"
                              alignItems="center"
                            >
                              {location.country} / {location.state} /{" "}
                              {location.city}
                              {" / "}
                              {location.address}
                              <LocationOn />
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className={styles.settingsContainer}>
              <div className={styles.banner}>
                FLIGHTS <AirplaneTicket />
              </div>
              <TableContainer className={styles.userTable} component={Paper}>
                <Table sx={{ width: "100%" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Button
                          variant="contained"
                          onClick={() => {
                            cleanNewLocationFields();
                            setIsNewFlightModalOpened(true);
                          }}
                        >
                          <AddCircle />
                        </Button>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ minWidth: "160px", wordBreak: "break-all" }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          disabled={!delFlights.length}
                          onClick={() => deleteFlightsHandler()}
                        >
                          <DeleteForever />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {user.userFlights.map((flight) => (
                      <TableRow key={flight.id}>
                        <TableCell component="th" scope="row">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const flightId = flight.id;
                              if (isChecked) {
                                return setDelFlights([...delFlights, flight]);
                              }
                              return setDelFlights(
                                delFlights.filter(
                                  (_flight) => _flight.id != flightId
                                )
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ minWidth: "160px", wordBreak: "break-all" }}
                        >
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                          >
                            <div>
                              <b>Departure date</b>
                            </div>
                            <CalendarMonth />
                          </Box>
                          <div>
                            {flight.departureDate.toDate().toLocaleDateString()}
                          </div>
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                          >
                            <div>
                              <b>Return date</b>
                            </div>
                            <CalendarMonth />
                          </Box>
                          <div>
                            {flight.returnDate.toDate().toLocaleDateString()}
                          </div>
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                          >
                            <div>
                              <b>Return location</b>
                            </div>
                            <LocationOn />
                          </Box>
                          <div>
                            {flight.returnCountry} / {flight.returnState} /{" "}
                            {flight.returnCity}
                            {" / "}
                            {flight.returnAddress}
                          </div>
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                          >
                            <div>
                              <b>Destinations</b>
                            </div>
                            <LocationOn />
                          </Box>
                          <div>{flight.destinations.join(", ")}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Account;
