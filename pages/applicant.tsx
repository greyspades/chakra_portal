import React, { useContext, useState, useEffect } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Dialog,
  Modal,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
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

const Applicant = () => {
  const { candidate, setCandidate, candidates, setCandidates } = useContext(
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
  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        router.push("/");
      }
      return false;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  //* fetches candidate application status data
  useEffect(() => {
    let data;
    let cred = sessionStorage.getItem("cred");
    if (cred) data = JSON?.parse(cred ?? "");

    if (data) {
      let body = {
        email: data.email,
      };
      axios
        .post(process.env.NEXT_PUBLIC_GET_STATUS as string, body)
        .then((res: AxiosResponse) => {
          if (res.data.code == 200 && res.data.data.length > 0) {
            setCandidates(res.data.data);
          } else if (res.data.code != 200 && res.data.length < 1) {
            setStatus({
              open: true,
              topic: "Unsuccessful",
              content: res.data.message,
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
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //* gets the roles
  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_GET_JOB_ROLES as string)
      .then((res: AxiosResponse) => {
        if (res.data.code == 200 && res.data.data.length > 0) {
          setRoles(res.data.data);
        }
      });
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
    axios
      .post(process.env.NEXT_PUBLIC_CANCEL_APPLICATION as string, body)
      .then((res) => {
        console.log(res.data);
        if (res.data.code == 200) {
          setStatus({
            open: true,
            topic: "Successful",
            content: "Application Cancelled Successfully",
          });
          var update = candidates?.map((item: Candidate) => {
            if (item.id == cancelId) {
              item.status = "Cancelled";
            }
            return item;
          });

          setCandidates(update);
        }
      })
      .catch((e) => {
        setStatus({
          open: true,
          topic: "Unsuccessful",
          content: e.message,
        });
      });
  };

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
      <div key={idx} className="">
        <Paper className="md:h-[400px] bg-slate-100 p-4 w-[400px]">
          <div className="flex flex-row text-green-700 font-semibold text-2xl">
            {item.firstName} {item.lastName}
          </div>
          <div className="flex flex-row place-items-center bg-white rounded-md mt-2">
            <div className="bg-white rounded-md p-1">Role Applied:</div>
            <div className="bg-white rounded-md text-green-700 font-semibold truncate ... md:w-[250px] md:ml-1">
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
              <div className="flex justify-center md:mt-[10px]">
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
        <TableCell className="">{candidate?.jobName}</TableCell>
        <TableCell className="">{roleData(candidate.roleId)?.unit}</TableCell>
        <TableCell className="">{candidate.applDate?.split("T")[0]}</TableCell>
        <TableCell className="">{candidate.stage}</TableCell>
        <TableCell className="">{candidate.status}</TableCell>
        <TableCell className="">
          {candidate?.status == "pending" && (
            <IconButton onClick={() => cancelPrompt(candidate?.id as string)}>
              <ChromeReaderModeIcon className="w-[30-px] h-[30px] text-green-700" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-row justify-between w-[100%] mt-[70px] px-6">
        <Paper className="p-2 mb-4">
          <p>Check your Application status</p>
        </Paper>
        <Paper className="md:h-[70px] bg-slate-100 p-1 w-[200px]">
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
          <Paper className="md:h-[400px] bg-slate-100 m-6 p-4 w-[100%]">
            <div className={"flex justify-center"}>
              {/* {renderApplications()} */}
              <TableContainer className="overflow-y-auto md:h-[350px]">
                <Table stickyHeader className="">
                  <TableHead sx={{ display: "table-header-group" }}>
                    <TableRow>
                      <TableCell>Job Applied</TableCell>
                      <TableCell>Unit</TableCell>
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
              candidates.length > 1
                ? "grid grid-cols-2 gap-[70px] justify-center p-6"
                : "grid justify-center"
            }
          >
            {renderApplications()}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Applicant;
