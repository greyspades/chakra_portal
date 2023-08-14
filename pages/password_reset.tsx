import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  Button,
  Modal,
  Input,
  CircularProgress,
  FormControl,
} from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Navbar } from "../components/navbar";
import { Notifier } from "../components/notifier";
import { Formik } from "formik";
import { PasswordReset } from "../helpers/validation";
import { useRouter } from "next/router";
import Footer from "../components/footer";
import { postAsync } from "../helpers/connection";

const Password = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [mail, setMail] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });

  const router = useRouter()

  useEffect(() => {
    const { email, token } = router.query
    if(email != null && router.isReady) {
      setMail(email as string)
    }
    if(token != process.env.NEXT_PUBLIC_RESET_TOKEN && router.isReady) {
      router.replace("/")
    }
  }, [router.isReady])

  // useEffect(() => {
  //   useEffect(() => {
  //     let auth = sessionStorage.getItem("auth");
  //     if (auth != "True") {
  //       router.push("/");
  //     } else {
  //       setAuthenticated(true);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);
  // }, [])

  const clearStatus = () => {
    setStatus({ open: false });
};

  return (
    <div className="h-[100vh] bg-slate-100 ">
      <Navbar />
      <Modal
        className="flex justify-center"
        open={status?.open ? true : false}
        onClose={clearStatus}
      >
        <div>
        <Notifier
          hasNext={status.hasNext}
          topic={status?.topic ?? ""}
          content={status?.content ?? ""}
          close={clearStatus}
        />
        </div>
      </Modal>
      <div className="flex justify-center">
        <Paper className="bg-white md:w-[40%] w-[97%] h-[350px] p-4 pb-8 mt-[80px]">
          <div className="flex justify-center">
            <p className="text-[22px] font-semibold">Reset your password</p>
          </div>
          <form>
            <Formik
              validationSchema={PasswordReset}
              initialValues={{ password: "", confirmPassword: "" }}
              onSubmit={(value) => {
                setLoading(true)
                let body = {
                  email: mail,
                  password: value.password
                }

                postAsync(process.env.NEXT_PUBLIC_RESET_PASSWORD as string, body)
                .then((res) => {
                  if(res.code == 200) {
                    setLoading(false)
                    setStatus({
                      open: true,
                      topic: "Successful",
                      content: res.message,
                      hasNext: false,
                  });
                  router.replace("/")
                  } else {
                    setLoading(false)
                    setStatus({
                      open: true,
                      topic: "Unsuccessful",
                      content: res.message,
                      hasNext: false,
                  });
                  }
                })
                .catch((err: AxiosError) => {
                  console.log(err.message)
                  setLoading(false)
                  setStatus({
                    open: true,
                    topic: "Successful",
                    content: err.message,
                    hasNext: false,
                });
                })
              }}
            >
              {({ handleChange, handleSubmit, values, errors }) => (
                <div className="flex flex-col place-items-center gap-8 justify-center mt-[20px]">
                  <FormControl>
                    <Input
                      value={values.password}
                      onChange={handleChange("password")}
                      placeholder="Your new Password"
                      disableUnderline
                      className="h-[40px] w-[300px] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
                    />
                    <div className="text-red-600 text-[10px] ml-4">
                      {errors.password as any}
                    </div>
                  </FormControl>
                  <FormControl>
                    <Input
                      value={values.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      placeholder="Confirm Password"
                      disableUnderline
                      className="h-[40px] w-[300px] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
                    />
                    <div className="text-red-600 text-[10px] ml-4">
                      {errors.confirmPassword as any}
                    </div>
                  </FormControl>

                  <div>
                    <Button onClick={handleSubmit as any} className="bg-green-700 h-[40px] capitalize text-white">
                      {loading ? (
                        <CircularProgress className="text-white w-[20px] h-[20px]" />
                      ) : (
                        <p>Submit</p>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Formik>
          </form>
        </Paper>
      </div>
      <div className="mt-[20px]">
        <Footer />
      </div>
    </div>
  );
};

export default Password;
