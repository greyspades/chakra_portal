import React, { useContext, useState, useEffect } from "react";
import { Paper, Stepper, Step, StepLabel, Button, Dialog } from "@mui/material";
import { MainContext } from "../context";
import axios, { AxiosResponse } from "axios";
import { Role } from "../types/roles";
import { Navbar } from "../Components/navbar";
import { useRouter } from "next/router";
import { Candidate } from "../types/candidate";
import Router from 'next/router'

const Applicant = () => {
  const { candidate, setCandidate, candidates, setCandidates } = useContext(MainContext) as any;
  const [role, setRole] = useState<Role>();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [cancelId, setCancelId] = useState<string>("");

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:5048/roles/Role/byId/${candidate.roleId}`)
  //     .then((res: AxiosResponse) => {
  //       // console.log(res.data.data[0])
  //       setRole(res.data.data[0]);
  //     });
  // }, []);

  useEffect(() => {
    // console.log(candidate)
    axios.get("http://localhost:5048/roles/Role")
    .then((res: AxiosResponse) => {
      if(res.data.code == 200 && res.data.data.length > 0) {
        setRoles(res.data.data)
      }
    })
  }, []);

  const roleData = (id: string): Role => {
    return roles?.find((item: Role) => item.id == id) as Role
  }

  const cancelApplication = () => {
    setDialogOpen(false)
    const body = {
        id:cancelId,
    }
    console.log(body)
    axios.post('http://localhost:5048/api/Candidate/cancel', body)
    .then((res) => {
      console.log(res.data)
        if(res.data.code == 200) {
            alert('Application cancelled successfully');
           var update = candidates?.map((item: Candidate) => {
            if(item.id == cancelId) {
              item.status = 'Cancelled'
            }
            return item;
           })

           setCandidates(update);
        }
    })
    .catch((e) => {
        console.log(e);
    })
  }

  const cancelPrompt = (id: string) => {
    setCancelId(id)
    setDialogOpen(true)
  }

  const renderApplications = () => {
    return candidates?.map((item: Candidate, idx: number) => (
      <div key={idx}>
        <Paper className="md:h-[400px] bg-slate-100 p-4 w-[400px]">
        <div className="flex flex-row text-green-700 font-semibold text-2xl">
          {item.firstName} {item.lastName}
        </div>
        <div className="flex flex-row place-items-center bg-white rounded-md mt-2">
          <div className="bg-white rounded-md p-1">Role Applied:</div>
          <div className="bg-white rounded-md  text-green-700 font-semibold ml-2">
          {roleData(item.roleId)?.name}
          </div>
        </div>
        <div className="flex flex-row place-items-center bg-white rounded-md mt-2">
          <div className="bg-white rounded-md p-1">Required Experience:</div>
          <div className="bg-white rounded-md  text-green-700 font-semibold ml-2">
          {roleData(item.roleId)?.experience}
          </div>
        </div>
        <div className="flex flex-row place-items-center bg-white rounded-md mt-2">
          <div className="bg-white rounded-md p-1">Unit:</div>
          <div className="ml-2 text-green-700 font-semibold ">
            {roleData(item.roleId)?.unit}
          </div>
        </div>
        <div className="flex flex-row place-items-center bg-white rounded-md mt-2">
          <div className="bg-white rounded-md p-1">Application Status:</div>
          <div className="bg-white rounded-md  ml-2 text-green-700 font-semibold">
            {item?.status}
          </div>
        </div>
        {item?.status == 'Pending' && (
          <div>
          <div className="md:mt-[20px]">
            <p className="text-xl font-semibold text-green-700 text-center mb-4">
                Application Stage
            </p>
          <Stepper activeStep={parseInt(item?.stage as string)} alternativeLabel sx={{
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
              <StepLabel>Selected</StepLabel>
            </Step>
          </Stepper>
        </div>
        <div className="flex justify-center md:mt-[10px]">
          <Button onClick={() => cancelPrompt(item?.id as string)} className="bg-green-700 text-white">
            Cancel Application
          </Button>
        </div>
          </div>
        )}
      </Paper>
      </div>
    ))
  }


  return (
    <div className="flex justify-center align-middle">
        <Dialog open={dialogOpen}>
        <div className="h-[170px] bg-white p-4">
          <p className="font-semibold text-xl">
            Cancel Application?
          </p>
          <p className="font-semibold mt-4">
            Are you sure you want to cancel this Application?
          </p>
          <div className="flex justify-end">
          <div className="flex flex-row justify-between w-[50%] mt-6">
            <Button onClick={() => setDialogOpen(false)} className="bg-green-700 text-white">
                No
            </Button>
            <Button onClick={() => cancelApplication()} className="bg-gray-400 text-white">
                Yes
            </Button>
          </div>
          </div>
        </div>
      </Dialog>
        <Navbar />
        <div className="mt-[80px]">
        {/* <div className="flex flex-row mt-[50px] mb-[20px]">
          <p className="text-2xl font-bold">
            Application Status
          </p>
        </div> */}
        <div className={candidates?.length > 1 ? "grid grid-cols-2 gap-16 justify-between" : "flex justify-center"}>
          {renderApplications()}
        </div>
        </div>
    </div>
  );
};

export default Applicant;
