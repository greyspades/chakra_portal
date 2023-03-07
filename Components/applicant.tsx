import React, { useEffect, useState } from "react";
import { Candidate } from "../types/candidate";
import { Divider, Button, CircularProgress, IconButton, Alert, AlertTitle } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import  Axios, { AxiosResponse }  from "axios";

type ApplicantProps = {
  data: Candidate;
  close: () => void;
  role: string;
};
export const Applicant = ({ data, close, role }: ApplicantProps) => {
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number>(0)

//   useEffect(() => {
//     console.log(data);
//   }, []);
const handleStatusChange = (code: number) => {
    setStatusCode(code);
    setTimeout(() => setStatusCode(0), 4000);
  };

const moveToNextStage = () => {
    setLoading(true)
    const body = {
        id:data.id,
        stage: '2'
    };
    Axios.post('http://localhost:5048/stage',body)
    .then((res: AxiosResponse) => {
        setLoading(false);
        console.log(res.data);
        handleStatusChange(res.data.code);
    })
}

const displayMessage = (code: number) => {
    switch (code) {
      case 200:
        return (
          <Alert
            className="h-[40px] p-1 pb-0 w-[350px]"
            variant="filled"
            severity="success"
          >
            <AlertTitle>Success</AlertTitle>
                Successfull
          </Alert>
        );
      case 400:
        return (
          <Alert
            className="h-[70px] p-1 pb-0 w-[350px]"
            variant="outlined"
            severity="error"
          >
            <AlertTitle>Error</AlertTitle>
            An Error Occured Processing your Request
          </Alert>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid col-span-1 h-[70%] gap-4">
          <div className="flex flex-row gap-4 text-green-700 font-semibold text-2xl">
            <p>{data.firstName}</p>
            <p>{data.lastName}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p>First name:</p>
            <p className="text-green-700 font-semibold">{data.firstName}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p>Last name:</p>
            <p className="text-green-700 font-semibold">{data.lastName}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="flex">Date of Birth:</p>
            <p className="text-green-700 font-semibold">
              {data.dob.split("T")[0]}
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <p>Phone Number:</p>
            <p className="text-green-700 font-semibold">{data.phone}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="flex">Email Address:</p>
            <p className="text-green-700 font-semibold flex">{data.email}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="flex">Application Date:</p>
            <p className="text-green-700 font-semibold flex">
              {data.applicationDate?.split('T')[0]}
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="flex">Application Stage:</p>
            <p className="text-green-700 font-semibold">{data.stage}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="flex">Application Status:</p>
            <p className="text-green-700 font-semibold flex">{data.status}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="flex">Role applied:</p>
            <p className="text-green-700 font-semibold flex">{role}</p>
          </div>
        </div>

        <div className="grid col-span-2">
          <div className="flex flex-row justify-items-center justify-between">
            <p className="text-green-700 font-semibold text-2xl">
            Resume
            </p>
            <IconButton onClick={close}>
          <ArrowBackIcon className='text-green-700' />
        </IconButton>
            {statusCode != 0 && (
                <div>
                    {displayMessage(statusCode as number)}
                </div>
            )}
          </div>
          <div className="w-[100%] h-[400px] rounded-md bg-white"></div>
        </div>
      </div>
      <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-4" />
      <div className="flex flex-row mt-4 justify-end gap-4">
      <Button className="bg-gray-400 text-white w-[200px]">
          {loading ? (
            <CircularProgress
              thickness={7}
              className="text-white w-[10px] h-[10px] p-1"
            />
          ) : (
            <p>Cancel Application</p>
          )}
        </Button>
        <Button className="bg-green-700 text-white w-[200px]" onClick={moveToNextStage}>
          {loading ? (
            <CircularProgress
              thickness={7}
              className="text-white w-[10px] h-[10px] p-1"
            />
          ) : (
            <p>Move to next Stage</p>
          )}
        </Button>
      </div>
    </div>
  );
};
