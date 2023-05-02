import React, { useState, useEffect, useContext } from "react";
import { Paper, Input, InputAdornment, IconButton, CircularProgress, Button, Modal } from "@mui/material";
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
import { Signup } from "../Components/applicationStages/signup";
import { Notifier } from "../Components/notifier";


const StatusForm = () => {
  // const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>();
  const [currCandidate, setCurCandidate] = useState<Candidate>();
  const [role, setRole] = useState<Role>();
  const [error, setError] = useState<string>();
  const router = useRouter();
  const [status, setStatus] = useState<{[key: string]: any}>({
    open: false
  })

  const { candidate, setCandidate, candidates, setCandidates, loggedIn, setLoggedIn } = useContext(MainContext) as any

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

  useEffect(() => {
    let data
    let cred = sessionStorage.getItem("cred")
    if(cred) data = JSON?.parse(cred ?? "");

    if(data) {
      // setLoggedIn(true)
      let body = {
        email: data.email,
        password: data.password
      }
      axios.post('http://localhost:5048/status', body)
    .then((res: AxiosResponse) => {
        setLoading(false);
        if(res.data.code == 200 && res.data.data.length > 0) {
              setCandidates(res.data.data)
              setLoggedIn(true)
            router.push("/applicant");
        }
        else if(res.data.code != 200 && res.data.length < 1) {
          setStatus({
            open: true,
            topic: "Unsuccessful",
            content: res.data.message
          })
        }})
    }
    // else {
    //   router.push("/")
    // }
  }, [])

  const clearStatus = () => setStatus({open: false})

  return (
    <div>
      <Navbar />
      <Modal className="flex justify-center" open={status?.open ? true : false} onClose={clearStatus}>
        <Notifier topic={status?.topic ?? ""} content={status?.content ?? ""} close={clearStatus}  />
      </Modal>
      <div className="mt-[100px] flex justify-center">
        {!loggedIn ? <Signup login={true} isStatus={true} /> : <CircularProgress thickness={7} className="text-green-700 w-[100px] h-[100px]" />}
      </div>
    </div>
  );
};

export default StatusForm;
