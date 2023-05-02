import React, { useState } from "react";
import {
  Input,
  IconButton,
  InputAdornment,
  Paper,
  FormControl,
  Button,
  Modal
} from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Formik } from "formik";
import { Navbar } from "../Components/navbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";
import { AdminForm } from "../helpers/validation";
import { Notifier } from "../Components/notifier";


const Signin = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{[key: string]: any}>({
    open: false
  })

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
                console.log(body)
                axios.post("http://localhost:5048/api/Candidate/admin/auth", body)
                .then((res: AxiosResponse) => {
                    setLoading(false);
                    console.log(res.data)
                    if(res.data.code == 200) {
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
                    console.log(e.message);
                    setLoading(false);
                })
              }}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <div className="mt-[20px] flex justify-center flex-col">
                  <FormControl>
                  <Input
                    value={values.userId}
                    onChange={handleChange("userId")}
                    placeholder="User Id"
                    className="px-2 bg-white h-[40px] w-[220px]"
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
                <div className="text-red-600 text-[10px] ml-4">
                  {errors.password as any}
                </div>
                  </FormControl>
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
