import React, { useState, useEffect, useContext } from "react";
import { Modal } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { MainContext } from "../context";
import { useRouter } from "next/router";
import { Notifier } from "./notifier";
import Link from "next/link";

interface NavProps {
  handleNav?: (item: string) => void;
  logOut?: () => void;
  next?: () => void;
}

export const Navbar = ({ handleNav, logOut, next }: NavProps) => {
  const { loggedIn, setLoggedIn } = useContext(MainContext) as any;
  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });

  //* nextjs navigation hook
  const router = useRouter();

  //* gets the candidate information from session storage
  useEffect(() => {
    let cred = sessionStorage.getItem("cred");
    if (cred) {
      setLoggedIn(true);
    }
  }, []);

  //* renders the names and paths of all pages
  const renderPageName = () => {
    switch (router.pathname) {
      case "/":
        return <p className="font-semibold md:text-2xl">Job Listings</p>;

      case "/statusform":
        return <p className="font-semibold md:text-2xl">Check Status</p>;

      case "/applicant":
        return <p className="font-semibold md:text-2xl">Application Status</p>;

      case "/admin":
        return <p className="font-semibold md:text-2xl">Admin</p>;

      case "/signin":
        return <p className="font-semibold md:text-2xl">Sign In</p>;

      case "/confirmation":
        return <p className="font-semibold md:text-2xl">Confirmation</p>;

      default:
        return <p></p>;
    }
  };

  //* logs the user out
  const logout = () => {
    sessionStorage.clear();
    setLoggedIn(false);
    clearStatus();
    next?.();
    router.push("/");
  };

  //* displays the logout notification
  const showLogout = () => {
    setStatus({
      open: true,
      topic: "Confirmation",
      content: "Are you sure you want to sign out?",
      hasNext: true,
    });
  };

  //* paths without a highlight on navbar
  const pathsWithoutStatus = ["/admin"];

  //* paths with a highlight
  const statusPages = ["/statusform", "/applicant"];

  //* clears the notifier state
  const clearStatus = () => setStatus({ open: false });

  //* checks session status and navigates to the application or status check screens
  const handleStatusNav = () => {
    if (loggedIn) {
      router.push("/applicant");
    } else {
      handleNav?.("status");
    }
  };

  const protectedRoutes = [
    "admin", "signup", "status"
  ]

  return (
    <div className="">
      <Modal
        className="flex justify-center"
        open={status?.open ? true : false}
        onClose={clearStatus}
      >
        <Notifier
          hasNext={status.hasNext}
          topic={status?.topic ?? ""}
          content={status?.content ?? ""}
          close={clearStatus}
          other={() => logout()}
        />
      </Modal>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" className="bg-white text-black max-h-[60px]">
          <Toolbar className="flex flex-row">
            <img
              className="grid col-span-1"
              src="/logo.png"
              width={100}
              height={100}
              alt={"/"}
            />
            <div className="flex flex-row justify-end ml-auto md:gap-8 gap-3">
              {router.pathname != "admin" && (
                <Link
                href="/"
                className={
                  router.pathname == "/"
                    ? "flex place-items-center text-black bg-green-300 h-[20px] w-[70px] md:text-[14px] text-[12px] md:h-[30px] md:w-[100px] text-center rounded-md p-1"
                    : "flex place-items-center text-black h-[20px] w-[70px] md:text-[14px] text-[12px] md:h-[30px] md:w-[100px]"
                }
              >
                Job listings
              </Link>
              )}
              {!pathsWithoutStatus.includes(router.pathname) && (
                <Link
                  onClick={handleStatusNav}
                  href={"#"}
                  className={
                    statusPages.includes(router.pathname)
                    ? "flex place-items-center text-black bg-green-300 h-[20px] w-[80px] md:text-[14px] text-[12px] md:h-[30px] md:w-[100px] text-center rounded-md p-1"
                    : "flex place-items-center text-black h-[20px] w-[70px] md:text-[14px] text-[12px] md:h-[30px] md:w-[100px]"
                  }
                >
                  Check Status
                </Link>
              )}
              {router.pathname == "/admin" && (
                <button onClick={logOut}>
                  Sign Out
                </button>
              )}
              {router.pathname != "/admin" && (
                <div className="text-[12px]">
                  {loggedIn ? (
                    <button
                      onClick={showLogout}
                      className="text-black h-[20px] w-[70px] md:text-[14px] text-[12px] md:h-[30px] md:w-[100px]"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNav?.("sign in")}
                      className="text-black h-[20px] w-[70px] md:text-[14px] text-[12px] md:h-[30px] md:w-[100px]"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};
