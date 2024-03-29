import React, { useState, useEffect, useContext } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
  IconButton,
  Input,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Modal,
  TextField,
} from "@mui/material";
import { Role } from "../../types/roles";
import { Candidate, Comment } from "../../types/candidate";
import { Meeting } from "../../types/meetings";
import { Applicant } from "../applicant";
import RefreshIcon from "@mui/icons-material/Refresh";
import LensIcon from "@mui/icons-material/Lens";
import { Notifier } from "../notifier";
import { MainContext } from "../../context";
import { Admin } from "../../types/admin";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';



export const Schedule = () => {
  const [roles, setRoles] = useState<Role[]>();
  const [candidate, setCandidate] = useState<Candidate>();
  const [roleId, setRoleId] = useState<string>("");
  const [role, setRole] = useState<Role>();
  const [meetings, setMeetings] = useState<Meeting[]>();
  const [viewing, setViewing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0)
  //* holds the notifier state
  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const { admin } = useContext(
    MainContext
  ) as any;

  const adminData = admin as Admin || null
  const [comment, setComment] = useState<Comment>({
    id: "",
    comment: "",
    firstName: adminData?.FirstName as string ?? "",
    lastName: adminData?.LastName as string ?? "",
  });

  //* gets active job roles
  useEffect(() => {
    let body = {
      value: "",
      page: 0,
      filter: ""
    }
    axios
      .post(process.env.NEXT_PUBLIC_GET_JOB_ROLES as string, body)
      .then((res: AxiosResponse) => {
        setRoles(res.data.data);
      });
  }, []);

  //* gets meetings for a job role
  const getMeetings = () => {
    let body = {
      id: roleId,
      page,
      take: 10
    }
    axios
      .post(process.env.NEXT_PUBLIC_GET_MEETINGS as string, body)
      .then((res: AxiosResponse) => {
        if (res.data.code == 200) {
          let sortedMeetings = res.data.data.sort(
            (a: Meeting, b: Meeting) =>
              new Date(a.date).getDate() - new Date(b.date).getDate()
          );
          let sortedTime = sortedMeetings.sort(
            (a: Meeting, b: Meeting) =>
              new Date(a.time).getTime() - new Date(b.time).getTime()
          );
          setMeetings(sortedTime);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.message);
      });

  }
  useEffect(() => {
    getMeetings()
  }, [roleId]);

  //* creates a new comment
  const handleComment = () => {
    setLoading(true);
    let body = { ...comment };
    axios
      .post(process.env.NEXT_PUBLIC_CREATE_COMMENT as string, body)
      .then((res: AxiosResponse) => {
        setLoading(false);
        if (res.data.code == 200) {
          setComment({
            id: "",
            comment: "",
            firstName: adminData?.FirstName as string,
            lastName: adminData?.LastName as string,
          })
          setStatus({
            open: true,
            topic: "Successful",
            content: "Successfully made comment",
          });
        }
      })
      .catch((err: AxiosError) => {
        setStatus({
          open: true,
          topic: "Unsuccessful",
          content: err.message,
        });
        setLoading(false);
      });
  };

  //* changes unit
  const handleJobChange = (event: SelectChangeEvent) => {
    setRoleId(event.target.value as string);
    var item: Role = roles?.find(
      (item: Role) => item.id == event.target.value
    ) as Role;
  };

  //* closes the dialog for creating comments
  const exitView = () => {
    setViewing(false);
  };

  //* renders the meeting status icon based on the day of the meeting
  const renderDayIcon = (val: string) => {
    let today = new Date().getDate();
    let day = new Date(val).getDate();
    if (today === day) {
      //* returns a green icon if the meeting is the current day
      return (
        <LensIcon
          style={{ color: "green" }}
          className=" w-[15px] h-[15px] mt-[-1px]"
        />
      );
    } else {
      //* returns an orange icon if the meeting is not the current day
      return (
        <LensIcon className=" w-[15px] h-[15px] mt-[-1px] text-orange-500 " />
      );
    }
  };

  //* getches candidate data and navigates to the next screen
  const handleViewChange = (id: string, job: string) => {
    let body = {
      id
    }
    axios
      .post(process.env.NEXT_PUBLIC_GET_CANDIDATE_BY_ID as string, body)
      .then((res: AxiosResponse) => {
        console.log(res.data)
        if (res.data.code == 200) {
          setCandidate(res.data.data[0]);
          let role = roles?.find((item: Role) => item.id == job);
          setRole(role);
          setViewing(true);
        }
      });
  };

  //* opens the dialog for creating comments
  const handleCommentOpen = (id: string) => {
    let data = { ...comment };
    data.id = id;
    setComment(data);
    setCommentOpen(true);
  };

  //* renders all meeting data
  const renderMeetings = () => {
    return meetings?.map((item: Meeting, idx: number) => (
      <div key={idx} className="mt-[10px] capitalize">
        <Accordion>
          <AccordionSummary>
            <div className="flex flex-row gap-2 justify-between w-[100%] text-[14px]">
              <div className="flex flex-row gap-1 w-[270px] text-ellipsis overflow-hidden ...">
                role:<p className="text-green-700">{item.jobTitle ?? "null"}</p>
              </div>
              <div className="flex flex-row gap-1">
                date:
                <p className="text-green-700">
                  {new Date(item.date.split("T")[0]).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-row gap-1">
                time:<p className="text-green-700">{item.time}</p>
              </div>
              <div className="flex flex-row gap-1 w-[150px] text-ellipsis overflow-hidden ...">
                firstname:
                <p className="text-green-700">{item.firstName ?? "null"}</p>
              </div>
              <div className="flex flex-row gap-1 w-[150px] text-ellipsis overflow-hidden ...">
                lastname:
                <p className="text-green-700">{item.lastName ?? "null"}</p>
              </div>
              {/* <div className="flex flex-row gap-1">
                status:
                <p className="text-green-700">
                  {renderDayIcon(item.date.split("T")[0])}
                </p>
              </div> */}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Divider
              variant="fullWidth"
              className="bg-green-700 h-[2px] mb-2"
            />
            <div className="flex flex-col gap-2">
              <div className="flex flex-row text-[14px] gap-1">
                <p className="">Meeting Id:</p>
                <p className="text-green-700">{item.meetingId}</p>
              </div>
              <div className="flex flex-row text-[14px] gap-1">
                <p className="">Meeting PassCode:</p>
                <p className="text-green-700">{item.password}</p>
              </div>
              <Divider
                variant="fullWidth"
                className="bg-green-700 h-[2px] mb-2"
              />
              <div className="flex flex-row gap-4">
                <Button
                  onClick={() =>
                    handleViewChange(item.participantId, item.jobId)
                  }
                  className="h-[30px] bg-green-700 text-white capitalize"
                >
                  View
                </Button>
                <Button
                  className="h-[30px] bg-green-700 text-white capitalize"
                  href={item.link}
                >
                  Start Meeting
                </Button>
                <Button
                  onClick={() => handleCommentOpen(item.participantId)}
                  className="h-[30px] bg-green-700 text-white capitalize"
                >
                  {loading ? (
                    <CircularProgress thickness={3} className="text-white" />
                  ) : (
                    <p>Comment</p>
                  )}
                </Button>
                <Button
                  onClick={() => moveToNextStage(item?.participantId)}
                  className="h-[30px] bg-green-700 text-white capitalize"
                >
                  {loading ? (
                    <CircularProgress thickness={3} className="text-white" />
                  ) : (
                    <p>Move to next stage</p>
                  )}
                </Button>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    ));
  };

  //* move candidate to the next stage
  const moveToNextStage = (id: string) => {
    setLoading(true);
    const body = {
      id: id,
      stage: "3",
    };
    axios
      .post(process.env.NEXT_PUBLIC_MOVE_TO_NEXT_STAGE as string, body)
      .then((res: AxiosResponse) => {
        setLoading(false);
        if (res.data.code == 200) {
          setStatus({
            open: true,
            topic: "Successful",
            content: res.data.message,
          });
        } else if (res.data.code) {
          setStatus({
            open: true,
            topic: "Unsuccessful",
            content: res.data.message,
          });
        }
      })
      .catch((err: AxiosError) => {
        setStatus({
          open: true,
          topic: "Unsuccessful",
          content: err.message,
        });
        setLoading(false);
      });
  };

  //* handles confirmation for the notifier
  const clearStatus = () => {
    setStatus({ open: false });
    setCommentOpen(false);
  };

  //* changes the comment based on type
  const handleCommentChange = (e: any, type: string) => {
    let data: { [key: string]: string } = { ...comment };
    data[type] = e.target.value;
    setComment(data as Comment);
  };

  const nextPage = () => {

  }

  const prevPage = () => {

  }

  return (
    <div>
      <Modal
        className="flex justify-center"
        open={status?.open ? true : false}
        onClose={clearStatus}
      >
        <Notifier
          topic={status?.topic ?? ""}
          content={status?.content ?? ""}
          close={clearStatus}
        />
      </Modal>
      <Modal
        className="flex justify-center capitalize"
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
      >
        <Paper className="md:w-[500px] md:h-[300px] bg-slate-100 justify-center p-4">
          <div className="flex justify-start">
            <p className="text-[20px] font-semibold text-start">
              Comment on Applicant
            </p>
          </div>
          <div className="flex flex-row justify-between mt-[20px]">
            <Input
              value={comment?.firstName}
              onChange={(e) => handleCommentChange(e, "firstName")}
              className="w-[200px] bg-white p-2 h-[40px]"
              placeholder="Commenters Firstname"
            />
            <Input
              value={comment?.lastName}
              onChange={(e) => handleCommentChange(e, "lastName")}
              className="w-[200px] bg-white p-2 h-[40px]"
              placeholder="Commenters Lastname"
            />
          </div>
          <div className="flex justify-center mt-6">
            <TextField
              value={comment?.comment}
              onChange={(e) => handleCommentChange(e, "comment")}
              className="w-[100%] bg-white p-2 border-none"
              placeholder="Comment"
              multiline
              minRows={2}
            />
          </div>
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleComment}
              className="bg-green-700 text-white capitalize"
            >
              {loading ? (
                <CircularProgress thickness={3} className="text-white" />
              ) : (
                <p>Submit</p>
              )}
            </Button>
          </div>
        </Paper>
      </Modal>
      <Paper
        className={
          !viewing
            ? "md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed capitalize"
            : "md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[97%] capitalize"
        }
      >
        {!viewing && (
          <div>
            <div className="mb-6 text-[]">
              <p>Pending Interviews</p>
            </div>
            <div className="flex flex-row justify-between">
              <FormControl>
                <InputLabel className="text-sm" id="demo-simple-select-label">
                  Role
                </InputLabel>
                <Select
                  value={roleId}
                  onChange={handleJobChange}
                  className="w-[170px] text-black bg-white h-[50px]"
                  label="Experience"
                  placeholder="Experience"
                  size="small"
                >
                  {roles ? roles?.map((item: Role, idx: number) => (
                    <MenuItem key={idx} className="text-black" value={item.id}>
                      {item.name}
                    </MenuItem>
                  )) : <div className="flex justify-center">
                  <CircularProgress className="w-[30px] h-[30px] text-green-700" />
                </div>}
                </Select>
              </FormControl>
              <IconButton
                onClick={() => setRoleId("")}
                className="bg-white w-[60px] h-[50px] rounded-sm flex flex-col"                
              >
                <p className="text-[11px]">Refresh</p>
                <RefreshIcon className="text-green-700" />
              </IconButton>
            </div>
            <Divider
              variant="fullWidth"
              className="bg-green-700 h-[2px] mt-2"
            />
            <div className="overflow-y-auto h-[400px]">{renderMeetings()}</div>

              <div className="flex justify-end">
            <div className="flex flex-row w-[20%] justify-between">
            <div className="flex flex-row justify-center place-items-center gap-4">
        <IconButton className="rounded-full shadow-md bg-white" onClick={prevPage}>
        <KeyboardArrowLeftIcon className="text-green-700 w-[30px] h-[30px]" />
        </IconButton>
      </div>
      <div className="flex flex-row place-items-center gap-4">
      <p className="semibold">
          Page
        </p>
        <p className="text-[18px] text-green-700 font-semibold">
          {page + 1}
        </p>
      </div>
      <div className="flex flex-row justify-center place-items-center gap-4">
        <IconButton className="rounded-full shadow-md bg-white" onClick={nextPage}>
        <KeyboardArrowRightIcon className="text-green-700 w-[30px] h-[30px]" />
        </IconButton>
      </div>
            </div>
              </div>
          </div>
        )}
        {viewing && (
          <div className="static">
            <Applicant
              close={exitView}
              data={candidate as Candidate}
              role={role as Role}
            />
          </div>
        )}
      </Paper>
    </div>
  );
};
