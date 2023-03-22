import React, { useContext, useState, useEffect } from "react";
import { Paper, Stepper, Step, StepLabel, Button } from "@mui/material";
import { MainContext } from "../context";
import axios, { AxiosResponse } from "axios";
import { Role } from "../types/roles";
import { Navbar } from "../Components/navbar";
import { useRouter } from "next/router";

const Applicant = () => {
  const { candidate, setCandidate } = useContext(MainContext) as any;
  const [role, setRole] = useState<Role>();
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`http://localhost:5048/roles/Role/byId/${candidate.roleId}`)
      .then((res: AxiosResponse) => {
        // console.log(res.data.data[0])
        setRole(res.data.data[0]);
      });
  }, []);

  const cancelApplication = () => {
    const body = {
        id:candidate?.id
    }
    axios.post('http://localhost:5048/cancel', body)
    .then((res) => {
        console.log(res.data);
        if(res.data.code == 200) {
            alert('Application cancelled successfully');
            router.push('/')
        }
    })
    .catch((e) => {
        console.log(e);
    })
  }


  return (
    <div className="flex justify-center align-middle">
        <Navbar />
      <Paper className="md:h-[500px] bg-slate-100 p-4 w-[500px] mt-[80px]">
        <div className="flex flex-row text-green-700 font-semibold text-2xl">
          {candidate.firstName} {candidate.lastName}
        </div>
        <div className="flex flex-row mt-4 bg-white rounded-md">
          <div className="bg-white rounded-md p-2">Role Applied:</div>
          <div className="bg-white rounded-md p-2 text-green-700 font-semibold ml-2">
            {" " + role?.name}
          </div>
        </div>
        <div className="flex flex-row mt-4 bg-white rounded-md">
          <div className="bg-white rounded-md p-2">Required Experience:</div>
          <div className="bg-white rounded-md p-2 text-green-700 font-semibold ml-2">
            {role?.experience + " Years"}
          </div>
        </div>
        <div className="flex flex-row mt-4 bg-white rounded-md">
          <div className="bg-white rounded-md p-2">Unit:</div>
          <div className="ml-2 text-green-700 font-semibold p-2">
            {role?.unit}
          </div>
        </div>
        <div className="flex flex-row mt-4 bg-white rounded-md">
          <div className="bg-white rounded-md p-2">Application Status:</div>
          <div className="bg-white rounded-md p-2 ml-2 text-green-700 font-semibold">
            {candidate?.status}
          </div>
        </div>
        {candidate?.status == 'Pending' && (
            <div className="md:mt-[20px]">
            <p className="text-xl font-semibold text-green-700 text-center mb-4">
                Application Stage
            </p>
          <Stepper activeStep={parseInt(candidate?.stage)} alternativeLabel sx={{
            "& .MuiStepLabel-root .Mui-active": { color: "green" },
            "& .MuiStepLabel-root .Mui-completed": { color: "green" },
            // "& .Mui-disabled .MuiStepIcon-root": { color: "green" }
          }}>
            <Step>
              <StepLabel
              >Submited</StepLabel>
            </Step>

            <Step>
              <StepLabel>Reviewing</StepLabel>
            </Step>

            <Step>
              <StepLabel>Interview</StepLabel>
            </Step>

            <Step>
              <StepLabel>Approved</StepLabel>
            </Step>
          </Stepper>
        </div>
        )}
        <div className="flex justify-center md:mt-[40px]">
          <Button onClick={cancelApplication} className="bg-green-700 text-white">
            Cancel Application
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Applicant;
