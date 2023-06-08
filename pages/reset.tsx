import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Modal,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Input,
} from "@mui/material";
import { MainContext } from "../context";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Role } from "../types/roles";
import { Navbar } from "../components/navbar";
import { useRouter } from "next/router";
import { Candidate } from "../types/candidate";
import { Notifier } from "../components/notifier";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import TableViewIcon from "@mui/icons-material/TableView";
import GridViewIcon from "@mui/icons-material/GridView";

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
        axios.post(process.env.NEXT_PUBLIC_SEND_PASS_RESET_MAIL as string, body)
        .then((res: AxiosResponse) => {
            console.log(res.data.data)
            if(res.data.code == 200) {
                setStatus({
                    open: true,
                    topic: "Successful",
                    content: res.data.message,
                    hasNext: false,
                });
                setCounting(true)
                setSentMail(true)
                startCountDown()
            }
        }).catch((err: AxiosError) => {
            console.log(err.message)
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
    <div>
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
            <div className="mt-[80px] flex justify-center">
            <Paper className="md:h-[50vh] bg-slate-100 p-1 w-[50vw]">
                <div className="mt-[30px]">
                    <p className="text-center">
                        Please enter your email address to reset your password
                    </p>
                </div>
                <div className="flex justify-center mt-[20px]">
                    <Input
                    value={mail}
                    onChange={handleMailChange}
                    className="bg-white px-2 w-[400px] h-[50px]"
                    placeholder="Your valid email address"
                    />
                </div>
                <div className="flex justify-center mt-[40px]">
                    <Button onClick={handleSubmit} className="bg-green-700 h-[50px] capitalize w-[400px] text-white">
                        Submit
                    </Button>
                </div>
                {sentMail &&(<p className="text-center text-[14px]">
                    Didn't recieve mail? click <Button onClick={handleSubmit} className="capitalize" disabled={time != 0 ? true : false}>here</Button> {counting && (<p>after ({time}),s</p>)}
                </p>)}
            </Paper>
        </div>
        )}
    </div>
  )
}

export default Reset