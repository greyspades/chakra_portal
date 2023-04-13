import React, { useState } from "react";
import {
  Input,
  IconButton,
  InputAdornment,
  Paper,
  FormControl,
  Button
} from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Formik } from "formik";
import { Navbar } from "../Components/navbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";


const Signin = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <Paper className="flex flex-col w-[40%] mt-[70px] justify-items-center md:h-[300px] bg-slate-100 overflow-y-scroll p-4">
          <div className="text-center text-xl font-semibold">
            Sign in as Admin
          </div>
          <form className="w-[100%] flex justify-center">
            <Formik
              initialValues={{
                userName: "",
                passWord: "",
              }}
              onSubmit={(value: any, { validateForm }) => {
                setLoading(true);
                const body = {
                    username: value.userName,
                    password: value.passWord
                }
                axios.post("http://localhost:5048/api/Admin/Auth", body)
                .then((res: AxiosResponse) => {
                    setLoading(false);
                    if(res.data.code == 200) {
                        router.push('/admin')
                    }
                    else {
                        alert('Your credentials are incorrect please check them and try again')
                    }
                }) 
                .catch((e: AxiosError) => {
                    console.log(e.message);
                    setLoading(false);
                })
              }}
            >
              {({ handleSubmit, handleChange, values }) => (
                <div className="mt-[20px] flex justify-center flex-col">
                  <Input
                    value={values.userName}
                    onChange={handleChange("userName")}
                    placeholder="User name"
                    className="px-2 bg-white h-[40px] w-[220px]"
                  />

                  <Input
                    value={values.passWord}
                    onChange={handleChange("passWord")}
                    placeholder="Password"
                    type={visible ? "text" : "password"}
                    className="px-2 bg-white mt-[20px] h-[40px] w-[220px]"
                    endAdornment={
                      <InputAdornment position="end">
                        {visible ? (
                          <IconButton onClick={() => setVisible(false)}>
                            <VisibilityIcon className="text-green-700" />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => setVisible(true)}>
                            <VisibilityOffIcon className="text-green-700" />
                          </IconButton>
                        )}
                      </InputAdornment>
                    }
                  />
                  <div className="flex justify-center mt-6">
                    <Button onClick={() => handleSubmit()} className="bg-green-700 text-white">
                        Sign In
                    </Button>
                  </div>
                </div>
              )}
            </Formik>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default Signin;
