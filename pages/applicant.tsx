import React, { useContext, useState, useEffect } from "react";
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
import Footer from "../components/footer";
import CryptoJS from "crypto-js";
import { getContent, postAsync, postContent } from "../helpers/connection";
import { lowerKey, lowerKeyArray } from "../helpers/formating";
import { connect } from "http2";


const Applicant = () => {
  const { candidates, setCandidates } = useContext(
    MainContext
  ) as any;
  const [role, setRole] = useState<Role>();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [cancelId, setCancelId] = useState<string>("");
  const [view, setView] = useState<string>("table");
  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });

  //* fixes navigation bug due to global contex being cleared by navigation
  // useEffect(() => {
  //   router.beforePopState(({ as }) => {
  //     if (as !== router.asPath) {
  //       router.push("/");
  //     }
  //     return false;
  //   });

  //   return () => {
  //     router.beforePopState(() => true);
  //   };
  // }, [router]);

  //* fetches candidate application status data
  useEffect(() => {
    let cred = sessionStorage.getItem("cred");
    if (cred) {
      let bytes = CryptoJS.AES.decrypt(cred ?? "", process.env.NEXT_PUBLIC_AES_KEY);
      let data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      let body = {
        email: data.email,
      };
      postAsync(process.env.NEXT_PUBLIC_GET_STATUS as string, body)
        .then((res) => {
          if (res.code == 200 && res.data.length > 0) {
            setCandidates(res.data);
          } else if (res.code != 200 && res.length < 1) {
            setStatus({
              open: true,
              topic: "Unsuccessful",
              content: res.message,
            });
          }
        })
        .catch((err: AxiosError) => {
          console.log(err.message);
          setStatus({
            open: true,
            topic: "Unsuccessful",
            content: err.message,
          });
        });}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getJobRoles = () => {
    let body = {
      value: "",
      page: 0,
      filter: ""
    }
    postAsync(process.env.NEXT_PUBLIC_GET_JOB_ROLES as string, body)
      .then((res) => {
        console.log(res)
        if (res.code == 200 && res.data.length > 0) {
          setRoles(res.data)
        }
      });
  }

  //* gets the roles
  useEffect(() => {
    getJobRoles()
  }, []);

  //* gets the role information based on id
  const roleData = (id: string): Role => {
    return roles?.find((item: Role) => item.id == id) as Role;
  };

  //* cancels the applicants application
  const cancelApplication = () => {
    setDialogOpen(false);
    const body = {
      id: cancelId,
    };
    postAsync(process.env.NEXT_PUBLIC_CANCEL_APPLICATION as string, body)
      .then((res) => {
        // console.log(res.data);
        // if (res.code == 200) {
        //   setStatus({
        //     open: true,
        //     topic: "Successful",
        //     content: "Application Cancelled Successfully",
        //   });
        //   var update = candidates?.map((item: Candidate) => {
        //     if (item.id == cancelId) {
        //       item.status = "Cancelled";
        //     }
        //     return item;
        //   });

        //   setCandidates(update);
        // }
      })
      .catch((e) => {
        setStatus({
          open: true,
          topic: "Unsuccessful",
          content: e.message,
        });
      });
  };

  const startOnBoarding = (id: string) => {
    let url = `/onboarding/${id}`;
    router.push(url);
  }

  //* displays cancel button to cancel the pending uperation
  const cancelPrompt = (id: string) => {
    setCancelId(id);
    setStatus({
      open: true,
      topic: "Confirmation",
      content: "Are you sure you want to cancel this application?",
      hasNext: true,
    });
  };

  //* renders all applications in grid form
  const renderApplications = () => {
    return candidates?.map((item: Candidate, idx: number) => (
      <div key={idx} className="flex justify-center">
        <Paper className="md:h-[400px] bg-white p-4 w-[99%] place-items-center">
          <div className="flex flex-row text-green-700 font-semibold md:text-2xl text-xl">
            {item.firstname} {item.lastname}
          </div>
          <div className="flex flex-row place-items-center bg-slate-100 rounded-md mt-2">
            <div className="bg-slate-100 rounded-md p-1">Applied for:</div>
            <div className="bg-slate-100 rounded-md text-green-700 font-semibold truncate ... md:w-[250px] md:ml-1">
              {roleData(item.roleid)?.name}
            </div>
          </div>
          <div className="flex flex-row place-items-center bg-slate-100 rounded-md mt-2">
            <div className="bg-slate-100 rounded-md p-1">Required Experience:</div>
            <div className="bg-slate-100 rounded-md  text-green-700 font-semibold ml-2">
              {roleData(item.roleid)?.experience}
            </div>
          </div>
          {/* <div className="flex flex-row place-items-center bg-slate-100 rounded-md mt-2">
            <div className="bg-slate-100 rounded-md p-1">Unit:</div>
            <div className="ml-2 text-green-700 font-semibold ">
              {roleData(item.roleId)?.unit}
            </div>
          </div> */}
          <div className="flex flex-row place-items-center bg-slate-100 rounded-md mt-2">
            <div className="bg-slate-100 rounded-md p-1">Application Status:</div>
            <div className="bg-slate-100 rounded-md  ml-2 text-green-700 font-semibold">
              {item?.status}
            </div>
          </div>
          {item?.status == "Pending" && (
            <div>
              <div className="md:mt-[20px]">
                <p className="text-xl font-semibold text-green-700 text-center mb-4">
                  Application Stage
                </p>
                <Stepper
                  activeStep={parseInt(item?.stage as string)}
                  alternativeLabel
                  sx={{
                    "& .MuiStepLabel-root .Mui-active": { color: "green" },
                    "& .MuiStepLabel-root .Mui-completed": { color: "green" },
                    // "& .Mui-disabled .MuiStepIcon-root": { color: "green" }
                  }}
                >
                  <Step>
                    <StepLabel>Submited</StepLabel>
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
              <div className="flex justify-center md:mt-[10px] mt-[20px]">
                <Button
                  onClick={() => cancelPrompt(item?.id as string)}
                  className="bg-green-700 text-white"
                >
                  Cancel Application
                </Button>
              </div>
            </div>
          )}
        </Paper>
      </div>
    ));
  };

  //* clears the notifier state
  const clearStatus = () => setStatus({ open: false });

  //* displays applications in table format
  const displayApplicantsTable = () => {
    return candidates?.map((candidate: Candidate, idx: number) => (
      <TableRow key={idx} hover role="checkbox" tabIndex={-1} className="">
        <TableCell className="">{candidate?.jobname}</TableCell>
        {/* <TableCell className="">{roleData(candidate.roleId)?.unit}</TableCell> */}
        <TableCell className="">{candidate.appldate?.split("T")[0]}</TableCell>
        <TableCell className="">{candidate.stage}</TableCell>
        <TableCell className="">{candidate.status}</TableCell>
        <TableCell className="">
          {candidate?.status == "Pending" && (
            <Button onClick={() => cancelPrompt(candidate?.id as string)} className="bg-green-700 h-[30px] w-[90px] text-white capitalize text-[12px]">
            Cancel
          </Button>
          )}
        </TableCell>
        <TableCell>
        {/* {candidate?.status == "Hired" && (
            <Button onClick={() => startOnBoarding(candidate?.id as string)} className="bg-green-700 h-[30px] w-[90px] text-white capitalize text-[12px]">
            onBoard
          </Button>
          )} */}
        </TableCell>
        
      </TableRow>
    ));
  };

  return (
    <div className="bg-slate-100 h-[100vh] md:text-[16px] text-[14px]">
      <Navbar />
      <div className="flex flex-row justify-between w-[100%] mt-[60px] px-6">
        {/* <Paper className="p-2 mb-4">
          <p>Check your Application status</p>
        </Paper> */}
        <Paper className="md:h-[70px] bg-white p-1 w-[200px] mt-[10px]">
          <div className="flex flex-row justify-between">
            <IconButton
              onClick={() => setView("table")}
              className="flex flex-col"
            >
              <TableViewIcon className="text-green-700 w-[30px] h-[30px]" />
              <p className="text-[11px]">Table</p>
            </IconButton>
            <IconButton
              onClick={() => setView("grid")}
              className="flex flex-col"
            >
              <GridViewIcon className="text-green-700 w-[30px] h-[30px]" />
              <p className="text-[11px]">Grid</p>
            </IconButton>
          </div>
        </Paper>
      </div>
      <div className="flex justify-center align-middle capitalize">
        <Modal
          className="flex justify-center"
          open={status?.open ? true : false}
          onClose={clearStatus}
        >
          <Notifier
            topic={status?.topic ?? ""}
            content={status?.content ?? ""}
            close={clearStatus}
            hasNext={status.hasNext}
            other={cancelApplication}
          />
        </Modal>
        {view == "table" ? (
          <Paper className="md:h-[400px] bg-white m-6 p-4 w-[100%]">
            <div className={"flex justify-center"}>
              {/* {renderApplications()} */}
              <TableContainer className="overflow-y-auto md:h-[350px]">
                <Table stickyHeader className="">
                  <TableHead sx={{ display: "table-header-group" }}>
                    <TableRow>
                      <TableCell>Job Applied</TableCell>
                      <TableCell>Application Date</TableCell>
                      <TableCell>Stage</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{displayApplicantsTable()}</TableBody>
                  <TableFooter>
                    <TableRow></TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </div>
          </Paper>
        ) : view == "grid" ? (
          <div
            className={
              candidates?.length > 1
                ? "grid md:grid-cols-2 md:gap-[70px] gap-4 justify-center p-6"
                : "grid justify-center"
            }
          >
            {renderApplications()}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Applicant;
