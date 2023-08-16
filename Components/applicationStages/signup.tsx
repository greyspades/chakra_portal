import React, { useState, useContext, useEffect } from "react";
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
import { Close } from "@mui/icons-material";
import NaijaStates from 'naija-state-local-government';
import { CustomInput } from "../customInput";
import HomeIcon from '@mui/icons-material/Home';
import { error } from "console";
import Link from "next/link";
import CryptoJs from "crypto-js"
import { lowerKey, lowerKeyArray } from "../../helpers/formating";
import { postAsync, getContent } from "../../helpers/connection";


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

  const [signInLoad, setsignInLoad] = useState<boolean>(false);

  const [signupLoad, setSignupLoad] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);

  const [gender, setGender] = useState<string>("Male");

  const [maritalStatus, setMaritalStatus] = useState<string>("Single");

  const [isLogin, setIsLogin] = useState<boolean>(login);

  const [phone, setPhone] = useState<string>("");

  const [reset, setReset] = useState<boolean>(false);

  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });

  const [location, setLocation] = useState<{[key: string]: string}>({
    state: "Lagos",
    lga: "Ikeja"
  })

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

  // useEffect(() => {
  //   // console.log(NaijaStates.lgas("Oyo"))
  //   console.log(NaijaStates.states())
  //   setLocation({ ...location, location?.state:})
  // },[location.state])

  //* handles phone number update
  const handlePhoneChange = (e: any) => {
    setPhone(e);
  };

  const handleLocationChange = (e: any, type: string) => {
    let update = { ...location, [type]: e.target.value}
    setLocation(update)
  }

  
  //* renames the fct state to abuja
  var updatedLoc = NaijaStates.states().map((item) => {
    if(item == "Federal Capital Territory") {
      item = "Abuja"
    }
    return item;
  })

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
            ? "flex flex-col md:w-[100%] w-[380px] m-0 justify-items-center md:h-[85%] h-[100%] bg-white overflow-y-scroll md:p-4 p-0 md:pb-0 pb-8"
            : "flex flex-col md:w-[400px] w-[380px] justify-items-center md:h-[450px] mt-[20px] bg-white overflow-y-scroll p-4"
        }
      >
        {/* if the context action is to signup a user */}
        {!isLogin && (
          <div>
            <div className="flex justify-center md:mt-0 mt-4 md:mb-[30px] mb-6">
              <p className="text-xl font-semibold md:ml-0 ml-8">Sign Up</p>
              <IconButton className="ml-auto mr-4 md:mr-0" onClick={exit}>
                <Close />
              </IconButton>
            </div>
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
                  setSignupLoad(true);
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
                    state: location.state,
                    lga: location.lga
                  };
                  let { password, ...sessionBody } = body;

                  let sessionData = JSON.stringify(sessionBody);

                  let encrypted = CryptoJs.AES.encrypt(sessionData, process.env.NEXT_PUBLIC_AES_KEY).toString()

                  postAsync(process.env.NEXT_PUBLIC_CREATE_NEW_USER as string, body)
                    .then((res) => {
                      setSignupLoad(false);
                      if (res.code == 200) {
                        sessionStorage.setItem("cred", encrypted);
                        setLoggedIn(true);
                        setStatus({
                          open: true,
                          topic: "Successful",
                          content: "Successfully Created a Profile, Please click the link sent to your email to continue",
                          hasNext: true,
                        });
                      } else {
                        setStatus({
                          open: true,
                          topic: "Unsuccessful",
                          content: res.message,
                        });
                      }
                    })
                    .catch((err: AxiosError) => {
                      console.log(err.message);
                      setSignupLoad(false);
                    });
                }}
              >
                {({ handleSubmit, handleChange, values, errors }) => (
                  <div className="grid justify-items-center">
                    <div className="flex md:flex-row flex-col gap-3">
                      <CustomInput
                        value={values.firstName}
                        onChange={handleChange("firstName")}
                        component={"text"}
                        placeHolder="First name"
                        classes="h-[40px] md:w-[270px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                        error={errors.firstName}
                        icon={<PersonIcon className="text-green-700" />}
                        fitWidth
                        required
                      />
                      <CustomInput
                        value={values.otherName}
                        onChange={handleChange("otherName")}
                        component={"text"}
                        placeHolder="Other name"
                        classes="h-[40px] w-[320px] md:w-[300px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                        error={errors.otherName}
                        icon={<PersonIcon className="text-green-700" />}
                        fitWidth
                      />
                      <CustomInput
                        value={values.lastName}
                        onChange={handleChange("lastName")}
                        component={"text"}
                        placeHolder="Last name"
                        classes="h-[40px] w-[320px] md:w-[270px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                        error={errors.lastName}
                        icon={<PersonIcon className="text-green-700" />}
                        fitWidth
                        required
                      />
                    </div>

                    <div className="flex md:flex-row flex-col mt-4 gap-4">
                      <CustomInput
                        value={values.email}
                        onChange={handleChange("email")}
                        component={"text"}
                        placeHolder="Email"
                        type="email"
                        classes="h-[40px] w-[320px] md:w-[300px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                        error={errors.email}
                        icon={<EmailIcon className="text-green-700" />}
                        fitWidth
                        required
                      />

                      <FormControl className="mt-[-5px]">
                        <div className="w-[100%] flex flex-row mb-[5px]">
                          <p className="mr-2 text-red-700 text-[14px] mt-[-5px]">
                            *
                          </p>
                          <p className="text-[11px]">Phone Number</p>
                        </div>
                        <PhoneInput
                         inputClass="h-[40px] w-[320px] md:w-[300px] bg-gray-100 rounded-md no-underline shadow-md"
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
                      <CustomInput
                        value={values.dob}
                        onChange={handleChange("dob")}
                        component={"text"}
                        type="date"
                        placeHolder="Date of birth"
                        classes="h-[40px] md:w-[200px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                        error={errors.dob}
                        // icon={<CalendarTodayIcon className="text-green-700" />}
                        fitWidth
                        required
                      />
                    </div>

                    <div className="flex md:flex-row flex-col gap-4 mt-4">
                      <CustomInput
                        value={gender}
                        onChange={(e: any) => setGender(e.target.value)}
                        component={"select"}
                        placeHolder="Gender"
                        selValues={genders}
                        classes="h-[40px] md:w-[150px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                        fitWidth
                        required
                      />

                      {/* <FormControl className="mt-[-8px]">
                        <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
                          <p className="mr-2 text-red-700 text-[13px]">*</p>
                          Marital Status
                        </div>
                        <Select
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value)}
                          className="h-[40px] w-[320px] md:w-[150px] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg mt-1"
                          label="Experience"
                          placeholder="Gender"
                          size="small"
                          disableUnderline
                        >
                          {maritalStatuses.map((item: string, idx: number) => (
                            <MenuItem key={idx} className="text-black" value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl> */}
                      <CustomInput
                        value={maritalStatus}
                        onChange={(e: any) => setMaritalStatus(e.target.value)}
                        component={"select"}
                        placeHolder="Marital Status"
                        selValues={maritalStatuses}
                        classes="h-[40px] md:w-[150px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                        fitWidth
                        required
                      />
                      <CustomInput
                        value={values.address}
                        onChange={handleChange("address")}
                        component={"text"}
                        placeHolder="Residential address"
                        classes="h-[40px] w-[320px] md:w-[500px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                        fitWidth
                        required
                        icon={<HomeIcon className="text-green-700" />}
                        error={errors.address}
                      />
                    </div>

                    <div className="flex md:flex-row flex-col md:mt-[30px] mt-2 justify-start md:gap-4 gap-2">
                      <CustomInput
                        value={location.state}
                        onChange={(e) => handleLocationChange(e, "state")}
                        component={"select"}
                        selValues={updatedLoc}
                        placeHolder="State"
                        classes="h-[40px] w-[320px] md:w-[150px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                        fitWidth
                        required
                      />
                      <CustomInput
                        value={location.lga}
                        onChange={(e) => handleLocationChange(e, "lga")}
                        component={"select"}
                        selValues={NaijaStates.lgas(location?.state)?.lgas}
                        placeHolder="City"
                        classes="h-[40px] w-[320px] md:w-[150px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                        fitWidth
                        required
                      />
                      <CustomInput
                        value={values.password}
                        onChange={handleChange("password")}
                        component={"text"}
                        placeHolder="Password"
                        type={visible ? "text" : "password"}
                        classes="h-[40px] w-[280px] md:w-[300px] bg-gray-100 rounded-md no-underline px-4 shadow-lg"
                        icon={        <IconButton onClick={() => setVisible(!visible)}>
                        {visible ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>}
                      error={errors.password}
                        endAdornment
                        fitWidth
                        required
                      />

                      <CustomInput
                        value={values.validPassword}
                        onChange={handleChange("validPassword")}
                        component={"text"}
                        placeHolder="Confirm Password"
                        type={visible ? "text" : "password"}
                        classes="h-[40px] w-[280px] md:w-[300px] bg-gray-100 rounded-md no-underline px-4 shadow-lg"
                        icon={        <IconButton onClick={() => setVisible(!visible)}>
                        {visible ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>}
                        error={errors.validPassword}
                        endAdornment
                        fitWidth
                        required
                      />
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
                      className="bg-green-700 text-white md:w-[60%] w-[85%] h-[40px]"
                      onClick={() => handleSubmit()}
                    >
                      {signupLoad ? (
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
          <div className="">
            {/* <div className="flex justify-end">
              
            </div> */}
            <div className="flex justify-center">
              <p className="text-xl font-semibold">Sign in</p>
              <IconButton className="ml-auto" onClick={exit}>
                <Close />
              </IconButton>
            </div>
            <form>
              <Formik
                validationSchema={SignInValidation}
                initialValues={{ email: "", password: ""}} 
                onSubmit={(value, { validateForm }) => {;
                  validateForm(value);
                  setsignInLoad(true);
                  let body = {
                    email: value.email,
                    password: value.password,
                  };
                  if (!isStatus) {
                    postAsync(process.env.NEXT_PUBLIC_SIGN_USER_IN as string, body)
                      .then((res) => {
                        if (res.code == 200) {
                          let encrypted = CryptoJs.AES.encrypt(JSON.stringify({...res.data, password: null}), process.env.NEXT_PUBLIC_AES_KEY).toString()
                          sessionStorage.setItem(
                            "cred",
                            encrypted
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
                            content: res.message,
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
                    postAsync(process.env.NEXT_PUBLIC_GET_STATUS as string, body)
                      .then((res) => {
                        setsignInLoad(false);
                        if (res.code == 200 && res.data.length > 0) {
                          setCandidates(res.data);
                          router.push("/applicant");
                        } else if (res.code != 200) {
                          setStatus({
                            open: true,
                            topic: "Unsuccessful",
                            content: res.message,
                          });
                        }
                      });
                  }
                }}
              >
                {({ handleSubmit, handleChange, values, errors }) => (
                  <div className="flex justify-center flex-col place-items-center">
                    <div className="mt-[20px]">
                      <CustomInput
                        value={values.email}
                        onChange={handleChange("email")}
                        component={"text"}
                        placeHolder="Email address"
                        classes="h-[40px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                        fitWidth
                        required
                        error={errors.email}
                        icon={<EmailIcon className="text-green-700" />}
                      />
                    </div>

                    <div className="mt-[20px]">
                      <CustomInput
                        value={values.password}
                        onChange={handleChange("password")}
                        component={"text"}
                        type={visible ? "text" : "password"}
                        placeHolder="Password"
                        classes="h-[40px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                        fitWidth
                        required
                        error={errors.password}
                        icon={<IconButton onClick={() => setVisible(!visible)}>
                        {visible ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>}
                        endAdornment
                      />
                    </div>
                    <div className="flex place-items-center mt-4 gap-2 text-[14px]">
                    <p>
                      Dont have an Account?{" "}
                      
                    </p>
                    <button
                        onClick={() => setIsLogin(false)}
                        className="text-green-700"
                      >
                        Sign Up
                      </button>
                    </div>
                    <div className="flex place-items-center mt-2 gap-2 text-[14px]">
                      <p>
                      Forgot your password? click
                      </p>
                      <Link
                        href="/reset"
                        className="text-green-700"
                      >
                        here
                      </Link>
                    </div>
                    <div className="mt-[30px]">
                      <Button
                        onClick={() => handleSubmit()}
                        className="bg-green-700 h-[40px] md:w-[320px] w-[320px] text-white"
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
