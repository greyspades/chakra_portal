import React, { useState, useEffect } from "react";
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

export const Navbar = () => {
  return (
    <div className="">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" className="bg-green-700 max-h-[60px]">
          <Toolbar className="grid grid-cols-3">
            <img
              className="grid col-span-1"
              src="http://10.0.0.143/img/icons/lapo_360_4.png"
              width={70}
              height={70}
            />
            <div className="grid grid-cols-5 col-span-2">
              <a href="/" className="grid text-white">
                Home
              </a>
              <a href="/" className="grid text-white">
                Signup
              </a>
              <a href="/" className="grid text-white">
                Login
              </a>
              <a href="/" className="grid text-white">
                Listings
              </a>
              <a href="/" className="grid text-white">
                Check Status
              </a>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};
