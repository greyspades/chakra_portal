import React, { useState, useEffect, FC, useContext } from "react";
import Axios, { AxiosError, AxiosResponse } from "axios";
import { Formik, ErrorMessage } from "formik";
import {
  Button,
  Input,
  InputAdornment,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Role } from "../../types/roles";
import { Fields } from "../../types/roles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MainContext } from "../../context";
import { useRouter } from "next/router";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import BookIcon from "@mui/icons-material/Book";
import CloseIcon from "@mui/icons-material/Close";
import {
  CandidateValidation,
  SignInValidation,
} from "../../helpers/validation";
import { Candidate } from "../../types/candidate";
import axios from "axios";

export const SignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div>
      <div className="mt-[60px]">
        <div>
          <p className="text-xl mt-[-40px] ml-[80px]">Sign in</p>
        </div>
        <form>
          <Formik
            validationSchema={SignInValidation}
            initialValues={{ email: "", password: "", validPassword: "" }}
            onSubmit={(value, { validateForm }) => {
              validateForm(value);
              setLoading(true);
              let body = {
                email: value.email,
                password: value.password,
              };

              axios.defaults.withCredentials = true;

              //* posts user information
              axios
                .post(process.env.NEXT_PUBLIC_SIGN_USER_IN as string, body)
                .then((res: AxiosResponse) => {
                  if (res.data.code == 200) {
                    sessionStorage.setItem(
                      "cred",
                      JSON.stringify(res.data.data)
                    );
                  } else {
                    alert(res.data.message);
                  }
                });
            }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <div className="flex justify-center flex-col place-items-center">
                <div className="mt-[20px]">
                  <FormControl>
                    <InputLabel>Email Address</InputLabel>
                    <Input
                      value={values.email}
                      onChange={handleChange("email")}
                      placeholder="Email Address"
                      className="bg-white rounded-md h-[40px] w-[280px] p-1 pr-0 mt-1 mb-0 m-3"
                    />
                    <div className="text-red-600 text-[10px] ml-4">
                      {errors.email as any}
                    </div>
                  </FormControl>
                </div>

                <div className="mt-[20px]">
                  <FormControl>
                    <InputLabel>Your Password</InputLabel>
                    <Input
                      placeholder="Password"
                      value={values.password}
                      type={visible ? "text" : "password"}
                      onChange={handleChange("password")}
                      className="bg-white rounded-md h-[40px] w-[280px] p-1 pr-0 mt-1px] mb-0 m-3"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={() => setVisible(!visible)}>
                            {visible ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <div className="text-red-600 text-[10px] ml-4">
                      {errors.password as any}
                    </div>
                  </FormControl>
                </div>

                <div className="mt-[20px]">
                  <FormControl>
                    <InputLabel>Retype Password</InputLabel>
                    <Input
                      placeholder="Retype Password"
                      value={values.validPassword}
                      type="password"
                      onChange={handleChange("validPassword")}
                      className="bg-white rounded-md h-[40px] w-[280px] p-1 pr-0 mt-1 mb-0 m-3"
                    />
                    <div className="text-red-600 text-[10px] ml-4">
                      {errors.validPassword as any}
                    </div>
                  </FormControl>
                </div>
                <p>
                  Dont have an Account?{" "}
                  <button
                    className="text-green-700 mt-6"
                  >
                    Sign Up
                  </button>
                </p>
                <div className="mt-[30px]">
                  <Button
                    onClick={() => handleSubmit()}
                    className="bg-green-700 h-[40px] w-[200px] text-white"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            )}
          </Formik>
        </form>
      </div>
    </div>
  );
};
