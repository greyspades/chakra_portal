import React, { useState, useContext } from "react";
import {
  Input,
  IconButton,
  InputAdornment,
  Paper,
  FormControl,
  Button,
  Modal,
  CircularProgress
} from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Formik } from "formik";
import { Navbar } from "../components/navbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";
import { AdminForm } from "../helpers/validation";
import { Notifier } from "../components/notifier";
import { MainContext } from "../context";
import CryptoJS from "crypto-js";


const Signin = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{[key: string]: any}>({
    open: false
  })

  const { admin, setAdmin } = useContext(
    MainContext
  ) as any;

  const router = useRouter();

  const clearStatus = () => setStatus({open: false})

  return (
    <div>
      <Modal className="flex justify-center" open={status?.open ? true : false} onClose={clearStatus}>
        <Notifier topic={status?.topic ?? ""} content={status?.content ?? ""} close={clearStatus}  />
      </Modal>
      <Navbar />
      <div className="flex justify-center">
        <Paper className="flex flex-col w-[40%] mt-[70px] justify-items-center md:h-[300px] bg-slate-100 overflow-y-scroll p-4">
          <div className="text-center text-xl font-semibold">
            Sign in as Admin
          </div>
          <form className="w-[100%] flex justify-center">
            <Formik
              validationSchema={AdminForm}
              initialValues={{
                userId: "",
                password: "",
              }}
              onSubmit={(value: any, { validateForm }) => {
                validateForm(value)
                setLoading(true);
                const body = {
                    id: value.userId,
                    password: value.password
                }
                axios.post(process.env.NEXT_PUBLIC_ADMIN_AUTH as string, body)
                .then((res: AxiosResponse) => {
                    setLoading(false);
                    if(res.data.code == 200) {
                        setAdmin(res.data.data)
                        sessionStorage.setItem("auth", "True")
                        router.push('/admin')
                    }
                    else {
                        setStatus({
                          open: true,
                          topic: "Unsuccessful",
                          content: res.data.message
                        })
                    }
                })
                .catch((e: AxiosError) => {
                  setStatus({
                    open: true,
                    topic: "Unsuccessful",
                    content: e.message,
                  });
                    setLoading(false);
                })
              }}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <div className="mt-[20px] flex justify-center flex-col gap-8">
                  <FormControl>
                  <Input
                    value={values.userId}
                    onChange={handleChange("userId")}
                    placeholder="User Id"
                    disableUnderline
                    className="h-[40px] w-[250px] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
                  />
                  <div className="text-red-600 text-[10px] ml-4">
                  {errors.userId as any}
                </div>
                  </FormControl>

                  <FormControl>
                  <Input
                    value={values.password}
                    onChange={handleChange("password")}
                    placeholder="Password"
                    disableUnderline
                    type={visible ? "text" : "password"}
                    className="h-[40px] w-[250px] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
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
                <div className="text-red-600 text-[10px] ml-4">
                  {errors.password as any}
                </div>
                  </FormControl>
                  <div className="flex justify-center mt-6">
                    <Button onClick={() => handleSubmit()} className="bg-green-700 text-white">
                        {loading ? <CircularProgress className="text-white" thickness={5} /> : <p>Sign In</p>}
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
