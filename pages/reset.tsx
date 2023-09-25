import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  Button,
  Modal,
  Input,
} from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Navbar } from "../components/navbar";
import { Notifier } from "../components/notifier";
import Footer from "../components/footer";
import { postAsync } from "../helpers/connection";


const Reset = () => {
    const [mail, setMail] = useState<string>()
    const [status, setStatus] = useState<{ [key: string]: any }>({
        open: false,
      });
    const [time, setTime] = useState<number>(10);
    const [counting, setCounting] = useState<boolean>(false);
    const [sentMail, setSentMail] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState(0)

    const countRef = useRef<any>(null);
    countRef.current = time

    const handleMailChange = (e: any) => {
        setMail(e.target.value)
    }

    useEffect(() => {
        setLoaded(true)
    }, [])

    const startCountDown = () => {
        if(intervalId == 0) {
            const interval = setInterval(() => {
                if(countRef.current <= 0) {
                    clearInterval(interval);
                }
                else {
                    setTime((old) => old - 1)  
                }
            }, 1000)
        } 
    }

    const handleSubmit = () => {
        let body = {
            email: mail
        }
        setSentMail(false)
        setCounting(false)
        postAsync("sendResetMail", body)
        .then((res) => {
            if(res.code == 200) {
                setStatus({
                    open: true,
                    topic: "Successful",
                    content: res.message,
                    hasNext: false,
                });
                setCounting(true)
                setSentMail(true)
                startCountDown()
            } else {
                setStatus({
                    open: true,
                    topic: "Unsuccessful",
                    content: res.message,
                    hasNext: false,
                });
            }
        }).catch((err: AxiosError) => {
            console.log(err.message)
            console.log(err.cause)
            setStatus({
                open: true,
                topic: "Unsuccessful",
                content: err.message,
                hasNext: false,
            });
        })
    }

    const clearStatus = () => {
        setStatus({ open: false });
    };

  return (
    <div className="h-[100vh] bg-slate-100">
    <Modal
        className="flex justify-center"
        open={status?.open ? true : false}
        onClose={clearStatus}
      >
        <Notifier
          hasNext={status.hasNext}
          topic={status?.topic ?? ""}
          content={status?.content ?? ""}
          close={clearStatus}
        />
      </Modal>
        <Navbar />
        {loaded &&(
            <div className="mt-[60px] flex justify-center">
            <Paper className="md:h-[50vh] bg-white p-1 md:w-[50vw] w-[97%] mt-[20px] pb-6">
                <div className="mt-[30px]">
                    <p className="text-center">
                        Please enter your email address to reset your password
                    </p>
                </div>
                <div className="flex justify-center mt-[20px]">
                    <Input
                    value={mail}
                    onChange={handleMailChange}
                    className="h-[40px] md:w-[65%] w-[97%] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg mt-1"
                    placeholder="Your valid email address"
                    />
                </div>
                <div className="flex justify-center mt-[40px]">
                    <Button onClick={handleSubmit} className="bg-green-700 h-[40px] capitalize md:w-[400px] w-[97%] text-white">
                        Submit
                    </Button>
                </div>
                {sentMail &&(<div className="w-[100%] flex flex-row justify-center place-items-center mt-8">
                    <p className="text-center text-[14px]">
                    Didn't recieve mail? click 
                </p>
                <div>
                <Button onClick={handleSubmit} className="capitalize" disabled={time != 0 ? true : false}>here</Button>
                </div>
                <div>
                {counting && (<p>after ({time}),s</p>)}
                </div>
                </div>)}
            </Paper>
        </div>
        )}
        <div className="mt-6">
        <Footer />
      </div>
    </div>
  )
}

export default Reset