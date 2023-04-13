import React, { useState } from 'react'
import { Paper, Input, Button, FormControl, InputLabel, CircularProgress } from "@mui/material"
import { Candidate } from '../../types/candidate'
import { Formik } from 'formik'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Role } from '../../types/roles'
import { Meeting } from '../../types/meetings'

interface ScheduleProps {
    candidate: Candidate,
    role: Role
}

export const ScheduleInterview:React.FC<ScheduleProps> = ({candidate, role}) => {
    const [loading, setLoading] = useState<boolean>();
    const [meetingInfo, setMeetingInfo] = useState<Meeting>();

  return (
    <div>
        <Paper className="w-[700px] bg-slate-100 p-4 mt-4 h-[550px] flex flex-col">
          <div>
          <p className='text-green-700 text-xl font-semibold'>
            Schedule Interview
          </p>
          </div>
          <div className='mt-10'>
            <form>
                <Formik initialValues={{
                    topic: '',
                    date: '',
                    time: '',
                }} onSubmit={(value, {validateForm}) => {
                    var body = {
                        date: value.date,
                        time: value.time,
                        topic: value.topic,
                        participantId: candidate.id,
                        firstName: candidate.firstName,
                        lastName: candidate.lastName,
                        // email: candidate.email,
                        // email: "ebelechukwunmoemenam@gmail.com",
                        email: candidate.email,
                        jobTitle: role.name,
                        jobId: role.id,
                    }
                    setLoading(true);
                    axios.post('http://localhost:5048/api/Candidate/meeting', body)
                    .then((res: AxiosResponse) => {
                        console.log(res.data)
                        if(res.data.code == 200) {
                            setMeetingInfo(res.data.data);
                            setLoading(false);
                        }
                        else if(res.data.code == 401) {
                            alert(res.data.message)
                        }
                    })
                    .catch((err: AxiosError) => {
                        console.log(err.message)
                        setLoading(false);
                    })

                }}>{({handleChange, handleSubmit, values}) => (
                    <div className='grid justify-center'>
                        <div className='flex flex-row gap-7'>
                        <FormControl>
                            <InputLabel className='mt-[-20px] text-[12px] ml-[-10px]'>
                                Day
                            </InputLabel>
                            <Input
                             value={values.date}
                             onChange={handleChange('date')}
                             className='text-black bg-white rounded-md h-[40px] w-[250px] px-2'
                             type='date'
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel className='mt-[-20px] text-[12px] ml-[-10px]'>
                                Time
                            </InputLabel>
                            <Input
                             value={values.time}
                             onChange={handleChange('time')}
                             className='text-black bg-white rounded-md h-[40px] w-[250px] px-2'
                             type='time'
                            />
                        </FormControl>
                        </div>

                        <div className='flex flex-row gap-7 mt-8'>
                        <FormControl>
                            <InputLabel className='text-[12px] ml-[-10px]'>
                                Candidate
                            </InputLabel>
                            <Input
                             value={candidate.email}
                             readOnly
                             className='text-black bg-white rounded-md h-[40px] w-[250px] px-2'
                             type='text'
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel className='mt-[-20px] text-[12px] ml-[-10px]'>
                                Topic
                            </InputLabel>
                            <Input
                             value={"Invitation for an Interactive Session"}
                             onChange={handleChange('topic')}
                             className='text-black bg-white rounded-md h-[40px] w-[250px] px-2'
                             type='text'
                             readOnly
                            />
                        </FormControl>
                        </div>
                        <Button onClick={() => handleSubmit()} className='bg-green-700 h-[50px] text-white mt-[30px]'>
                            {
                                loading ? <CircularProgress thickness={5} className='text-white' /> : <p>
                                Schedule
                                </p>
                            }
                        </Button>
                    </div>
                )}

                </Formik>
            </form>
            <div className='mt-[20px] px-6'>
                <div className='flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2'>
                    <p>MeetingId:</p>
                    <p className='text-green-700 font-semibold'>{meetingInfo?.meetingId}</p>
                </div>

                <div className='flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2'>
                    <p>Password:</p>
                    <p className='text-green-700 font-semibold'>{meetingInfo?.password}</p>
                </div>

                <div className='flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2'>
                    <p>Meeting Link:</p>
                    <p className='text-green-700 font-semibold'>{meetingInfo?.link}</p>
                </div>

                <div className='flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2'>
                    <p>Date:</p>
                    <p className='text-green-700 font-semibold'>{meetingInfo?.date.split(" ")[0]}</p>
                </div>

                <div className='flex flex-row bg-white rounded-md p-0.5 px-2 mt-2 gap-2'>
                    <p>Time:</p>
                    <p className='text-green-700 font-semibold'>{meetingInfo?.date.split(" ")[1]}</p>
                </div>

            </div>
          </div>
        </Paper>
    </div>
  )
}