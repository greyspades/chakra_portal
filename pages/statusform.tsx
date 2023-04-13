import React, { useState, useEffect, useContext } from "react";
import { Paper, Input, InputAdornment, IconButton, CircularProgress, Button } from "@mui/material";
import { Formik } from "formik";
import axios, { AxiosResponse } from "axios";
import { Navbar } from "../Components/navbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Candidate } from "../types/candidate";
import { Role } from "../types/roles";
import { validate } from "../helpers/validation";
import { useRouter } from "next/router";
import { MainContext } from "../context";
import { SignInValidation } from "../helpers/validation";

const StatusForm = () => {
  const [visible, setVisible] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [currCandidate, setCurCandidate] = useState<Candidate>();
  const [role, setRole] = useState<Role>();
  const [error, setError] = useState<string>();
  const router = useRouter();

  const { candidate, setCandidate, candidates, setCandidates } = useContext(MainContext) as any

  const search = () => {

  }

  const getRole = (id: string) => {
    axios.get(`http://localhost:5048/roles/Role/byId/${id}`)
    .then((res: AxiosResponse) => {
        if(res.data.code == 200) {
            setRole(res.data.data);
        }
    })
  }

  // useEffect(() => {
  //   axios.get(`http://localhost:5048/roles/Role/byId/${candidate?.roleId}`)
  //   .then((res: AxiosResponse) => {
  //       if(res.data.code == 200) {
  //           setRole(res.data.data);
  //       }
  //   })
  // }, [candidate?.roleId])

  return (
    <div>
      <Navbar />
      <div className="grid mt-[100px] justify-center">
        <Paper className="grid w-[400px] justify-center col-span-1 bg-slate-100 p-4 h-[350px] rounded-md">
        <p className="m-2 text-2xl font-semibold text-center">
            Please Sign In
        </p>
          <form>
            <Formik
              validationSchema={SignInValidation}
              initialValues={{ email: "", password: "" }}
              onSubmit={(value, { validateForm }) => {
                setLoading(true);
                validateForm(value);
                const body = {
                    email: value.email,
                    password: value.password
                }
                const valid = validate(body, 'status')
                
                  axios.post('http://localhost:5048/status', body)
                .then((res: AxiosResponse) => {
                    setLoading(false);
                    console.log(res.data)
                    if(res.data.code == 200 && res.data.data.length > 0) {
                          setCandidates(res.data.data)
                        // setCandidate(res.data.data[0]);
                        // setCurCandidate(res.data.data[0]);
                        router.push("/applicant");
                    }
                    else if(res.data.code == 200 && res.data.length < 1) {
                      alert('Applicant does not exist, please check the email and password')
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
                
                // else {
                //   setError('Please fill out a valid Username and Password');
                // }
              }}
            >
              {({ handleChange, handleSubmit, values, errors }) => (
                <div>
                  <div className="grid">
                    <div>
                    <Input
                      placeholder="Email"
                      value={values.email}
                      onChange={handleChange("email")}
                      className="bg-white rounded-md h-[40px] w-[280px] p-1 pr-0 m-3"
                      startAdornment={
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      }
                    />
                    {errors.email && (
                      <p className="text-red-700 text-[12px] ml-4">
                        {errors.email}
                      </p>
                    )}
                    </div>

                    <div>
                    <Input
                      placeholder="Password"
                      value={values.password}
                      type={visible ? "text" : "password"}
                      onChange={handleChange("password")}
                      className="bg-white rounded-md h-[40px] w-[280px] p-1 pr-0 m-3"
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
                    {errors.email && (
                      <p className="text-red-700 text-[12px] ml-4">
                        {errors.password}
                      </p>
                    )}
                    </div>
                        {error ! && (
                          <div className="text-red-500 text-center ">
                            {error}
                          </div>
                        )}
                       <div className="flex justify-center md:mt-8">
                       <Button
                      onClick={() => handleSubmit()}
                      className="text-white bg-green-700 w-[100px] h-[40px]"
                    >
                      {loading ? <CircularProgress /> : <p>Login</p>}
                    </Button>
                       </div>
                  </div>
                </div>
              )}
            </Formik>
          </form>
        </Paper>

        {/* <div className="grid col-span-3">
            <Paper className=" md:h-[400px] bg-slate-100 p-6 align-middle md:fixed w-[72%]">
                <div className="flex text-green-700 font-semibold text-2xl">
                    <p>
                        {candidate?.firstName}
                    </p>
                    <p className="ml-4">
                        {candidate?.lastName}
                    </p>
                </div>
            </Paper>
        </div> */}
      </div>
    </div>
  );
};

export default StatusForm;
