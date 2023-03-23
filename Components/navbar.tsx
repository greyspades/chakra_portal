import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { Formik } from "formik";
import { Input, InputAdornment, Accordion } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { MainContext } from "../context";
import { useRouter } from "next/router";

export const Navbar = () => {
  const {  } = useContext(MainContext) as any
  const router = useRouter();

  return (
    <div className="">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" className="bg-green-700 max-h-[60px]">
          <Toolbar className="grid grid-cols-5">
            <img
              className="grid col-span-1"
              src="http://10.0.0.143/img/icons/lapo_360_4.png"
              width={70}
              height={70}
            />
            <div className="grid grid-cols-2 col-span-4 justify-end ml-auto gap-8">
              <a href="/" className={router.pathname == "/" ? "grid text-white bg-[#90c9a1] h-[30px] w-[100px] text-center rounded-md p-1" : "grid text-white w-[50px]"}>
              Home
              </a>
  
              <a href="/statusform" className={router.pathname == "/applicant" ? "grid text-white bg-[#90c9a1] h-[30px] w-[100px] text-center rounded-md p-1" : "grid text-white w-[100px]"}>
                Check Status
              </a>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};
