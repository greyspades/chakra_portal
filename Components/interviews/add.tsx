import React, { useState } from "react";
import {
  Paper,
  Input,
  Button,
  FormControl,
  InputLabel,
  CircularProgress,
  Modal,
  IconButton,
} from "@mui/material";
import { Candidate } from "../../types/candidate";
import { Formik } from "formik";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Role } from "../../types/roles";
import { Meeting } from "../../types/meetings";
import { InterviewForm } from "../../helpers/validation";
import { Notifier } from "../notifier";
import { Close } from "@mui/icons-material";
import { postAsync } from "../../helpers/connection";

interface ScheduleProps {
  candidate: Candidate;
  role: Role;
  close: () => void;
}

export const ScheduleInterview: React.FC<ScheduleProps> = ({
  candidate,
  role,
  close
}) => {
  const [loading, setLoading] = useState<boolean>();

  const [meetingInfo, setMeetingInfo] = useState<Meeting>();

  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });

  //* closes the notifier and clears notification state
  const clearStatus = () => setStatus({ open: false });

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
      <Paper className="w-[700px] bg-slate-100 p-4 mt-4 h-[550px] flex flex-col">
        <div className="flex flex-row justify-between">
          <p className="text-green-700 text-xl font-semibold">
            Schedule Interview
          </p>
          <IconButton onClick={close}>
            <Close />
          </IconButton>
        </div>
        <div className="mt-10">
          <form>
            <Formik
              validationSchema={InterviewForm}
              initialValues={{
                topic: "",
                date: "",
                time: "",
              }}
              onSubmit={(value, { validateForm }) => {
                validateForm(value);
                var body = {
                  date: value.date,
                  time: value.time,
                  topic: value.topic,
                  participantId: candidate.id,
                  firstName: candidate.firstname,
                  lastName: candidate.lastname,
                  email: candidate.email,
                  jobTitle: role.name,
                  jobId: role.id,
                };
                setLoading(true);
                //* creates a new online meeting
                postAsync(process.env.NEXT_PUBLIC_CREATE_MEETING as string, body)
                  .then((res) => {
                    //* if operation is successful
                    if (res.code == 200) {
                      setMeetingInfo(res.data);
                      setLoading(false);
                    } else if (res.code == 401) {
                      setLoading(false)
                      setStatus({
                        open: true,
                        topic: "Unsuccessful",
                        content: res.message,
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
              }}
            >
              {({ handleChange, handleSubmit, values, errors }) => (
                <div className="grid justify-center">
                  <div className="flex flex-row gap-7">
                    <FormControl>
                      <div className="text-[12px] mb-1">Day</div>
                      <Input
                        value={values.date}
                        onChange={handleChange("date")}
                        className="text-black bg-white rounded-md h-[40px] w-[250px] px-2"
                        type="date"
                      />
                      <div className="text-red-600 text-[10px] ml-4">
                        {errors.date as any}
                      </div>
                    </FormControl>
                    <FormControl>
                      <div className="text-[12px] mb-1">Time</div>
                      <Input
                        value={values.time}
                        onChange={handleChange("time")}
                        className="text-black bg-white rounded-md h-[40px] w-[250px] px-2"
                        type="time"
                      />
                      <div className="text-red-600 text-[10px] ml-4">
                        {errors.time as any}
                      </div>
                    </FormControl>
                  </div>
                  <div className="flex flex-row gap-7 mt-8">
                    <FormControl>
                      <InputLabel>Candidate</InputLabel>
                      <Input
                        value={candidate.email}
                        readOnly
                        className="text-black bg-white rounded-md h-[40px] w-[250px] px-2"
                        type="text"
                      />
                    </FormControl>
                    <FormControl>
                      <InputLabel>Topic</InputLabel>
                      <Input
                        value={"Invitation for an Interactive Session"}
                        onChange={handleChange("topic")}
                        className="text-black bg-white rounded-md h-[40px] w-[250px] px-2"
                        type="text"
                        readOnly
                      />
                      <div className="text-red-600 text-[10px] ml-4">
                        {errors.topic as any}
                      </div>
                    </FormControl>
                  </div>
                  <Button
                    onClick={() => handleSubmit()}
                    className="bg-green-700 h-[50px] text-white mt-[30px]"
                  >
                    {loading ? (
                      <CircularProgress thickness={5} className="text-white" />
                    ) : (
                      <p>Schedule</p>
                    )}
                  </Button>
                </div>
              )}
            </Formik>
          </form>
          <div className="mt-[20px] px-6">
            <div className="flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2">
              <p>MeetingId:</p>
              <p className="text-green-700 font-semibold">
                {meetingInfo?.meetingid}
              </p>
            </div>

            <div className="flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2">
              <p>Password:</p>
              <p className="text-green-700 font-semibold">
                {meetingInfo?.password}
              </p>
            </div>

            <div className="flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2">
              <p>Meeting Link:</p>
              <p className="text-green-700 font-semibold">
                {meetingInfo?.link}
              </p>
            </div>

            <div className="flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2">
              <p>Date:</p>
              {meetingInfo?.date && (
                <div>
                  <p className="text-green-700 font-semibold">
                    {meetingInfo?.date?.split(" ")?.[0]}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2">
              <p>Time:</p>
              {meetingInfo?.date && (
                <div>
                  <p className="text-green-700 font-semibold">
                    {meetingInfo?.date?.split(" ")?.[1]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};
