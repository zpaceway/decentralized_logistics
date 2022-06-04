import "../styles/globals.scss";
import type { AppProps } from "next/app";
import useUser from "../hooks/useUser";
import UserContext from "../context/UserContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (router.route === "/") {
      router.push("/login");
    } else if (router.route === "/login" && user.currentUser) {
      router.push("/dashboard/account");
    } else if (
      router.route &&
      !user.currentUser &&
      user.currentUser !== undefined
    ) {
      router.push("/login");
    }
  }, [router.route, user.currentUser]);

  return (
    <UserContext.Provider value={user}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
