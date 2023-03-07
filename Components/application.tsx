import React, { useState, useEffect, FC, useContext } from "react";
import Axios from "axios";
import { Formik } from "formik";
import {
  Button,
  Input,
  InputAdornment,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Role } from "../types/roles";
import { Fields } from "../types/roles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MainContext } from "../context";
import { useRouter } from "next/router";

export const Application: FC<Role> = ({
  deadline,
  experience,
  unit,
  salary,
  name,
  id,
}: Role) => {
  const [info, setInfo] = useState<{
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    password: string;
    phone: string;
    roleId: string;
  }>();
  const [file, setFile] = useState<File>();

  const [loading, setLoading] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);

  const { candidate, setCandidate, role, setRole } = useContext(
    MainContext
  ) as any;

  const router = useRouter();

  const fields: Fields[] = [
    {
      name: "firstName",
      icon: <PersonIcon />,
      placeholder: "First name",
    },
    {
      name: "lastName",
      icon: <PersonIcon />,
      placeholder: "Last name",
    },
    {
      name: "phone",
      icon: <PhoneIcon />,
      placeholder: "Phone Number",
    },
    {
      name: "email",
      icon: <EmailIcon />,
      placeholder: "Email Address",
    },
    {
      name: "dob",
      icon: <EmailIcon />,
      placeholder: "Date Of Birth",
    },
  ];

  const handleUpload = (e: any, handleChange: any) => {
    setFile(e.target.files[0]);
    handleChange("cv");
  };

  return (
    <Paper className="md:h-[500px] bg-slate-100 ">
      <h3 className="text-2xl text-green-700 font-semibold text-center mt-4">
        Application Form
      </h3>
      <div className="grid grid-cols-3 p-6 align-middle pb-0 w-[100%]">
        <div className="grid grid-rows-5 h-[200px]">
          <div>Role: {name}</div>
          <div>Unit: {unit}</div>
          <div>Experience: {experience}</div>
          <div>Salary: {salary}</div>
          <div>Deadline: {deadline.toString().split("T")[0]}</div>
        </div>
        <div className="grid grid-rows-2">
          <form>
            <Formik
              initialValues={{
                dob: new Date(),
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                phone: "",
                cv: "",
              }}
              onSubmit={(value: any) => {
                setLoading(true);
                console.log(id);
                var body = {
                  firstName: value.firstName.toString(),
                  lastName: value.lastName.toString(),
                  email: value.email.toString(),
                  password: value.password.toString(),
                  phone: value.phone.toString(),
                  roleId: id,
                  dob: value.dob.toString(),
                  // cv: file
                };
                var role = {
                  deadline,
                  experience,
                  unit,
                  salary,
                  name,
                  id,
                };
                var headers = {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                };
                Axios.post("http://localhost:5048/api/Candidate", body, {
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                  },
                  withCredentials: false,
                })
                  .then((res) => {
                    if (res.data.code == 200) {
                      console.log(res);
                      setLoading(false);
                      setCandidate(body);
                      setRole(role);
                      // window.location.href = "/confirmation";
                      router.push("/confirmation");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    setLoading(false);
                  });
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <div className="">
                  <div className="grid grid-cols-2 md:w-[200%]">
                    <div>
                      <Input
                        placeholder="First name"
                        required
                        value={values.firstName}
                        onChange={handleChange("firstName")}
                        className="bg-white rounded-md h-[40px] w-[250px] p-4 m-3"
                        startAdornment={
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        }
                      />
                    </div>

                    <div>
                      <Input
                        placeholder="Last Name"
                        required
                        value={values.lastName}
                        onChange={handleChange("lastName")}
                        className="bg-white rounded-md h-[40px] w-[250px] p-4 m-3"
                        startAdornment={
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        }
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Email Address"
                        value={values.email}
                        required
                        onChange={handleChange("email")}
                        className="bg-white rounded-md h-[40px] w-[250px] p-4 m-3 md:"
                        startAdornment={
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        }
                      />
                    </div>

                    <div>
                      <Input
                        placeholder="Select a Password"
                        value={values.password}
                        required
                        type={visible ? "text" : "password"}
                        onChange={handleChange("password")}
                        className="bg-white rounded-md h-[40px] w-[250px] p-4 pr-0 m-3 md:"
                        startAdornment={
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        }
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
                    </div>

                    <div>
                      <Input
                        placeholder="Phone Number"
                        value={values.phone}
                        required
                        onChange={handleChange("phone")}
                        className="bg-white rounded-md h-[40px] w-[250px] p-4 m-3 md:"
                        startAdornment={
                          <InputAdornment position="start">
                            <PhoneIcon />
                          </InputAdornment>
                        }
                      />
                    </div>

                    <div>
                      <Input
                        placeholder="Date of Birth"
                        type="date"
                        required
                        value={values.dob}
                        onChange={handleChange("dob")}
                        className="bg-white rounded-md h-[40px] w-[250px] p-4 m-3 md:"
                      />
                    </div>

                    <div>
                      <Input
                        placeholder="Your Resume"
                        type="file"
                        required
                        value={values.cv}
                        onChange={handleChange("cv")}
                        // onChange={(e) => handleUpload(e, handleChange)}
                        className="bg-white rounded-md h-[40px] w-[250px] p-4 m-3 md:"
                      />
                    </div>
                  </div>
                  <div className="grid justify-center w-[190%] mt-[20px]">
                    <Button
                      onClick={() => handleSubmit()}
                      className="text-white bg-green-700 w-[100px] h-[40px]"
                    >
                      {loading ? <CircularProgress /> : <p>Submit</p>}
                    </Button>
                  </div>
                </div>
              )}
            </Formik>
          </form>
        </div>
      </div>
    </Paper>
  );
};
