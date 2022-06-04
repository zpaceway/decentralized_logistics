import {
  Button,
  FormControl,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Global.module.scss";
import { AirplaneTicket, Delete, Email, Person } from "@mui/icons-material";
import { useRef, useState } from "react";
import { createUser, login } from "../../firebase";
import { Timestamp } from "firebase/firestore";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const idFileReference = useRef(null);

  return (
    <div className={styles.login}>
      <Head>
        <title>CARGO</title>
        <meta name="description" content="DLA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <FormControl className={styles.form}>
          <Typography variant="h2" component="h2" fontWeight={900}>
            <div className={styles.logo}>
              CARGO <AirplaneTicket></AirplaneTicket>
            </div>
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {isNewUser && (
            <>
              <TextField
                label="Repeat Password"
                variant="outlined"
                value={repeatPassword}
                type="password"
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              <TextField
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Button
                variant="outlined"
                className={styles.button}
                endIcon={idFile ? <Delete /> : <Person />}
                onClick={() => {
                  if (idFile) {
                    (idFileReference.current as any).value = "";
                    return setIdFile(null);
                  }
                  return (idFileReference?.current as any).click();
                }}
                color={idFile ? "error" : "primary"}
              >
                {idFile ? "Remove Id File" : "Upload Id File"}
                <input
                  ref={idFileReference}
                  type="file"
                  hidden
                  onChange={(e) => {
                    setIdFile((e.target as any).files[0]);
                  }}
                />
              </Button>
            </>
          )}
          <Button
            className={styles.button}
            variant="contained"
            size="large"
            endIcon={<Email />}
            onClick={() => {
              if (isNewUser) {
                if (password === repeatPassword)
                  return createUser(
                    {
                      active: false,
                      createdAt: Timestamp.fromDate(new Date()),
                      updatedAt: Timestamp.fromDate(new Date()),
                      firstName,
                      lastName,
                      email,
                    },
                    password,
                    idFile
                  );
              }
              return login(email, password);
            }}
          >
            {isNewUser ? "Register " : "Login"}
          </Button>
          <Link
            className={styles.isNewUser}
            onClick={() => setIsNewUser((_isNewUser) => !isNewUser)}
          >
            {isNewUser
              ? "I already have an account"
              : "I don't have an account"}
          </Link>
        </FormControl>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Login;
