import React, { useState, useContext } from "react";
import Axios, { AxiosError, AxiosResponse } from "axios";
import { Formik } from "formik";
import {
  Button,
  Input,
  InputAdornment,
  Paper,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MainContext } from "../../context";
import { useRouter } from "next/router";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  CandidateValidation,
  SignInValidation,
} from "../../helpers/validation";
import axios from "axios";
import { Notifier } from "../notifier";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface SignupProps {
  exit?: () => void;
  next?: () => void;
  login: boolean;
  isStatus?: boolean;
  nextPage?: string;
}

export const Signup = ({
  exit,
  next,
  login,
  isStatus,
  nextPage,
}: SignupProps) => {
  const [info, setInfo] = useState<{
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    password: string;
    phone: string;
    roleId: string;
  }>();

  const [loading, setLoading] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);

  const [gender, setGender] = useState<string>("Male");

  const [maritalStatus, setMaritalStatus] = useState<string>("Single");

  const [isLogin, setIsLogin] = useState<boolean>(login);

  const [phone, setPhone] = useState<string>("");

  const [reset, setReset] = useState<boolean>(false);

  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });

  const genders = ["Male", "Female"];

  const maritalStatuses: string[] = ["Single", "Married", "Divorced"];

  const router = useRouter();

  const { setCandidates, loggedIn, setLoggedIn } = useContext(
    MainContext
  ) as any;

  const clearStatus = () => setStatus({ open: false });

  //* handles the next action for the notifier
  const handleNext = () => {
    setStatus({ open: false });
    if (status.topic == "Successful") {
      exit?.();
      next?.();
    }
    router.push(`/${nextPage}`);
  };

  //* handles phone number update
  const handlePhoneChange = (e: any) => {
    setPhone(e);
  };

  return (
    <div>
      {/* notifier component served in a modal */}
      <Modal
        className="flex justify-center"
        open={status?.open ? true : false}
        onClose={clearStatus}
      >
        <Notifier
          topic={status?.topic ?? ""}
          content={status?.content ?? ""}
          close={handleNext}
          hasNext={status?.hasNext}
          other={handleNext}
        />
      </Modal>
      <Paper
        className={
          !isLogin
            ? "flex flex-col w-[100%] justify-items-center md:h-[85%] bg-slate-100 overflow-y-scroll p-4"
            : "flex flex-col w-[400px] justify-items-center md:h-[500px] bg-slate-100 overflow-y-scroll p-4"
        }
      >
        {/* if the context action is to signup a user */}
        {!isLogin && (
          <div>
            <p className="text-center font-bold text-xl mt-4 mb-4">
              Personal Information
            </p>
            <form>
              <Formik
                validateOnChange={true}
                validateOnBlur={false}
                validationSchema={CandidateValidation}
                initialValues={{
                  firstName: "",
                  lastName: "",
                  otherName: "",
                  email: "",
                  phone: "",
                  dob: "",
                  password: "",
                  address: "",
                  validPassword: "",
                }}
                onSubmit={(value) => {
                  // validateForm(value);
                  setLoading(true);
                  var body = {
                    firstName: value.firstName,
                    lastName: value.lastName,
                    otherName: value.otherName,
                    email: value.email,
                    phone: phone.toString(),
                    dob: value.dob.toString(),
                    gender: gender,
                    password: value.password,
                    address: value.address,
                    maritalStatus: maritalStatus,
                  };
                  console.log(body)
                  let { password, ...sessionBody } = body;

                  let sessionData = JSON.stringify(sessionBody);
                  Axios.post(process.env.NEXT_PUBLIC_CREATE_NEW_USER as string, body, {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                    },
                  })
                    .then((res: AxiosResponse) => {
                      setLoading(false);
                      if (res.data.code == 200) {
                        sessionStorage.setItem("cred", sessionData);
                        setLoggedIn(true);
                        setStatus({
                          open: true,
                          topic: "Successful",
                          content: "Successfully Created a Profile, Please click the link sent to your email to continue",
                          hasNext: true,
                        });
                        // exit?.()
                        // next?.()
                      } else {
                        setStatus({
                          open: true,
                          topic: "Unsuccessful",
                          content: res.data.message,
                        });
                      }
                    })
                    .catch((err: AxiosError) => {
                      console.log(err.message);
                      setLoading(false);
                    });
                }}
              >
                {({ handleSubmit, handleChange, values, errors }) => (
                  <div className="grid justify-items-center">
                    <div className="flex flex-row gap-3">
                      <FormControl>
                        <InputLabel className="w-[100%] flex flex-row">
                          <p className="mr-2 text-red-700 text-[20px]">*</p>
                          First Name
                        </InputLabel>
                        <Input
                          placeholder="First name"
                          required
                          value={values.firstName}
                          onChange={handleChange("firstName")}
                          className="bg-white rounded-md h-[40px] w-[270px] p-2 mb-0 m-1"
                          startAdornment={
                            <InputAdornment position="start">
                              <PersonIcon className="text-green-700" />
                            </InputAdornment>
                          }
                        />
                        <div className="text-red-600 text-[10px] ml-4">
                          {errors.firstName as any}
                        </div>
                      </FormControl>

                      <FormControl>
                        <InputLabel className="w-[100%] flex flex-row">
                          Other Name
                        </InputLabel>
                        <Input
                          placeholder="Other Name"
                          required
                          value={values.otherName}
                          onChange={handleChange("otherName")}
                          className="bg-white rounded-md h-[40px] w-[270px] p-2 mb-0 m-1"
                          startAdornment={
                            <InputAdornment position="start">
                              <PersonIcon className="text-green-700" />
                            </InputAdornment>
                          }
                        />
                        <div className="text-red-600 text-[10px] ml-4">
                          {errors.otherName as any}
                        </div>
                      </FormControl>

                      <FormControl>
                        <InputLabel className="w-[100%] flex flex-row">
                          <p className="mr-2 text-red-700 text-[20px]">*</p>
                          Last Name
                        </InputLabel>
                        <Input
                          placeholder="Last name"
                          required
                          value={values.lastName}
                          onChange={handleChange("lastName")}
                          className="bg-white rounded-md h-[40px] w-[270px] p-4 mb-0 m-1"
                          startAdornment={
                            <InputAdornment position="start">
                              <PersonIcon className="text-green-700" />
                            </InputAdornment>
                          }
                        />
                        <div className="text-red-600 text-[10px] ml-4">
                          {errors.lastName as any}
                        </div>
                      </FormControl>
                    </div>

                    <div className="flex flex-row mt-4">
                      <FormControl>
                        <InputLabel className="w-[100%] flex flex-row">
                          <p className="mr-2 text-red-700 text-[20px]">*</p>
                          Email
                        </InputLabel>
                        <Input
                          placeholder="Email Address"
                          required
                          value={values.email}
                          onChange={handleChange("email")}
                          className="bg-white rounded-md h-[40px] w-[300px] p-4 mb-0 m-3"
                          startAdornment={
                            <InputAdornment position="start">
                              <EmailIcon className="text-green-700" />
                            </InputAdornment>
                          }
                        />
                        <div className="text-red-600 text-[10px] ml-4">
                          {errors.email as any}
                        </div>
                      </FormControl>
                      <FormControl className="mt-[-5px]">
                        <div className="w-[100%] flex flex-row mb-[5px]">
                          <p className="mr-2 text-red-700 text-[14px] mt-[-5px]">
                            *
                          </p>
                          <p className="text-[11px]">Phone Number</p>
                        </div>
                        <PhoneInput
                          country={"ng"}
                          value={phone}
                          onChange={(phone) => handlePhoneChange(phone)}
                          enableSearch={true}
                          containerStyle={{
                            height: 40,
                          }}
                          inputStyle={{
                            height: 40,
                          }}
                        />
                      </FormControl>

                      <FormControl className="mt-[-6px]">
                        <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
                          <p className="mr-2 text-red-700 text-[13px]">*</p>
                          Date of Birth
                        </div>
                        <Input
                          placeholder="Date of Birth"
                          required
                          value={values.dob}
                          type="date"
                          onChange={handleChange("dob")}
                          className="bg-white rounded-md h-[40px] w-[200px] p-4 mt-1 mb-0 m-3"
                          startAdornment={
                            <InputAdornment position="start">
                              <CalendarTodayIcon className="text-green-700" />
                            </InputAdornment>
                          }
                        />
                        <div className="text-red-600 text-[10px] ml-4">
                          {errors.dob as any}
                        </div>
                      </FormControl>
                    </div>

                    <div className="flex flex-row gap-4 mt-4">
                      <FormControl className="mt-[-8px]">
                        <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
                          <p className="mr-2 text-red-700 text-[13px]">*</p>
                          Gender
                        </div>
                        <Select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-[150px] text-black bg-white h-[40px] mt-1"
                          label="Experience"
                          placeholder="Gender"
                          size="small"
                        >
                          {genders.map((item: string, idx: number) => (
                            <MenuItem key={idx} className="text-black" value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl className="mt-[-8px]">
                        <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
                          <p className="mr-2 text-red-700 text-[13px]">*</p>
                          Marital Status
                        </div>
                        <Select
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value)}
                          className="w-[150px] text-black bg-white h-[40px] mt-1"
                          label="Experience"
                          placeholder="Gender"
                          size="small"
                        >
                          {maritalStatuses.map((item: string, idx: number) => (
                            <MenuItem key={idx} className="text-black" value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <InputLabel>Address</InputLabel>
                        <Input
                          value={values.address}
                          onChange={handleChange("address")}
                          placeholder="Residential Address"
                          className="bg-white rounded-md h-[40px] w-[500px] p-4 mt-1 mb-0 m-3"
                          startAdornment={
                            <InputAdornment position="start">
                              <CalendarTodayIcon className="text-green-700" />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </div>

                    <div className="flex flex-row mt-[20px] justify-start">
                      <FormControl className="">
                        <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
                          <p className="mr-2 text-red-700 text-[13px]">*</p>
                          Password
                        </div>
                        <Input
                          placeholder="Password"
                          value={values.password}
                          type={visible ? "text" : "password"}
                          onChange={handleChange("password")}
                          className="bg-white rounded-md h-[40px] w-[280px] p-1 pr-0 mt-1 mb-0 m-3"
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

                      <FormControl className="">
                        <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
                          <p className="mr-2 text-red-700 text-[13px]">*</p>
                          Confirm Password
                        </div>
                        <Input
                          placeholder="Confirm Password"
                          value={values.validPassword}
                          type={visible ? "text" : "password"}
                          onChange={handleChange("validPassword")}
                          className="bg-white rounded-md h-[40px] w-[280px] p-1 pr-0 mt-1 mb-0 m-3"
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
                          {errors.validPassword as any}
                        </div>
                      </FormControl>
                    </div>
                    <p>
                      Already Have an Account?{" "}
                      <button
                        onClick={() => setIsLogin(true)}
                        className="text-green-700 my-6"
                      >
                        Sign In
                      </button>
                    </p>
                    <Button
                      className="bg-green-700 text-white w-[200px] h-[50px]"
                      onClick={() => handleSubmit()}
                    >
                      {loading ? (
                        <CircularProgress
                          thickness={7}
                          className="text-white w-[40px] h-[40px] p-1"
                        />
                      ) : (
                        <p>Submit</p>
                      )}
                    </Button>
                  </div>
                )}
              </Formik>
            </form>
          </div>
        )}

        {/* if the context action is to log the user in */}
        {isLogin && (
          <div className="mt-[60px]">
            <div>
              <p className="text-xl mt-[-40px] ml-[80px]">Sign in</p>
            </div>
            <form>
              <Formik
                validationSchema={SignInValidation}
                initialValues={{ email: "", password: "", validPassword: "" }}
                onSubmit={(value, { validateForm }) => {;
                  validateForm(value);
                  setLoading(true);
                  let body = {
                    email: value.email,
                    password: value.password,
                  };
                  if (!isStatus) {
                    axios
                      .post(process.env.NEXT_PUBLIC_SIGN_USER_IN as string, body)
                      .then((res: AxiosResponse) => {
                        if (res.data.code == 200) {
                          sessionStorage.setItem(
                            "cred",
                            JSON.stringify(res.data.data)
                          );
                          setLoggedIn(true);
                          setStatus({
                            open: true,
                            topic: "Successful",
                            content: "Successfully Logged in",
                          });
                        } else {
                          setStatus({
                            open: true,
                            topic: "Unsuccessful",
                            content: res.data.message,
                          });
                        }
                      })
                      .catch((err: AxiosError) => {
                        console.log(err.message);
                        setStatus({
                          open: true,
                          topic: "Unsuccessful",
                          content: err.message,
                        });
                      });
                  } else {
                    axios
                      .post(process.env.NEXT_PUBLIC_GET_STATUS as string, body)
                      .then((res: AxiosResponse) => {
                        setLoading(false);
                        if (res.data.code == 200 && res.data.data.length > 0) {
                          setCandidates(res.data.data);
                          router.push("/applicant");
                        } else if (res.data.code != 200) {
                          setStatus({
                            open: true,
                            topic: "Unsuccessful",
                            content: res.data.message,
                          });
                        }
                      });
                  }
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
                    <p>
                      Dont have an Account?{" "}
                      <button
                        onClick={() => setIsLogin(false)}
                        className="text-green-700 mt-6"
                      >
                        Sign Up
                      </button>
                    </p>
                    <p>
                      Forgot your password? click{" "}
                      <button
                        onClick={() => router.push("reset")}
                        className="text-green-700 mt-6"
                      >
                        here
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
        )}
      </Paper>
    </div>
  );
};
