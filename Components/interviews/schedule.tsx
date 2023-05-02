import React, { useState, useEffect} from 'react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Divider, IconButton, Input, Dialog, Accordion, AccordionDetails, AccordionSummary, Button, CircularProgress, Modal } from "@mui/material"
import { Role } from '../../types/roles'
import { Candidate } from '../../types/candidate'
import { Meeting } from '../../types/meetings'
import { Applicant } from '../applicant'
import TodayIcon from '@mui/icons-material/Today';
import RefreshIcon from '@mui/icons-material/Refresh';
import LensIcon from "@mui/icons-material/Lens";
import { Notifier } from '../notifier'


export const Schedule = () => {
  const [roles, setRoles] = useState<Role[]>();
  const [candidate, setCandidate] = useState<Candidate>();
  const [roleId, setRoleId] = useState<string>("all");
  const [role, setRole] = useState<Role>();
  const [meetings, setMeetings] = useState<Meeting[]>();
  const [viewing, setViewing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{[key: string]: any}>({
    open: false
  })

  useEffect(() => {
    axios.get("http://localhost:5048/roles/Role").then((res: AxiosResponse) => {
      setRoles(res.data.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:5048/api/Candidate/meetings/${roleId}`).then((res: AxiosResponse) => {
          console.log(res.data)
          if(res.data.code == 200) {
            let sortedMeetings = res.data.data.sort((a: Meeting, b: Meeting) => new Date(a.date).getDate() - new Date(b.date).getDate());
            let sortedTime = sortedMeetings.sort((a: Meeting, b: Meeting) => new Date(a.time).getTime() - new Date(b.time).getTime());
            setMeetings(sortedTime);
          }
        })
        .catch((err: AxiosError) => {
          console.log(err.message)
        });
  }, [roleId]);

  const handleUnitChange = (event: SelectChangeEvent) => {
    console.log(event.target.value)
    setRoleId(event.target.value as string);
    var item: Role = roles?.find((item: Role) => item.id == event.target.value) as Role;
  };

  const getRole = (id: string) => {
   let role = roles?.find((item: Role) => item.id == id)
   return role;
  }

  const exitView = () => {
    setViewing(false)
  }

  const renderDayIcon = (val: string) => {
    let today = new Date().getDate()
    let day = new Date(val).getDate()
    if(today === day) {
      return <LensIcon
      style={{color: "green"}}
      className=" w-[15px] h-[15px] mt-[-1px]"
    />
    }
    else {
      return <LensIcon
      // style={{color: "orange-700"}}
      className=" w-[15px] h-[15px] mt-[-1px] text-orange-500 "
    />
    }
  }

  const handleViewChange = (id: string, job: string) => {
    axios.get(`http://localhost:5048/api/Candidate/${id}`)
    .then((res: AxiosResponse) => {
      console.log(res.data)
      if(res.data.code == 200) {
        setCandidate(res.data.data[0]);
        let role = roles?.find((item: Role) => item.id == job);
        setRole(role);
        setViewing(true);
      }
    })
  }

  const renderMeetings = () => {
    return meetings?.map((item: Meeting, idx: number) => (
      <div key={idx} className='mt-[10px] capitalize'>
        <Accordion>
          <AccordionSummary>
            <div className='flex flex-row gap-4 justify-between'>
              <div className='flex flex-row gap-1 w-[300px] text-ellipsis overflow-hidden ...'>role:<p className='text-green-700'>{item.jobTitle ?? "null"}</p></div>
              <div className='flex flex-row gap-1'>date:<p className='text-green-700'>{new Date(item.date.split("T")[0]).toLocaleDateString()}</p></div>
              <div className='flex flex-row gap-1'>time:<p className='text-green-700'>{item.time}</p></div>
              <div className='flex flex-row gap-1 w-[150px] text-ellipsis overflow-hidden ...'>firstname:<p className='text-green-700'>{item.firstName ?? "null"}</p></div>
              <div className='flex flex-row gap-1 w-[150px] text-ellipsis overflow-hidden ...'>lastname:<p className='text-green-700'>{item.lastName ?? "null"}</p></div>
              <div className='flex flex-row gap-1'>status:<p className='text-green-700'>{renderDayIcon(item.date.split("T")[0])}</p></div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Divider variant='fullWidth' className='bg-green-700 h-[2px] mb-2' />
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row text-[14px] gap-1'>
                <p className=''>
                Meeting Id:
                </p>
              <p className='text-green-700'>
                {item.meetingId}
              </p>
              </div>

              <div className='flex flex-row text-[14px] gap-1'>
                <p className=''>
                Meeting PassCode:
                </p>
              <p className='text-green-700'>
                {item.password}
              </p>
              </div>
              <Divider variant='fullWidth' className='bg-green-700 h-[2px] mb-2' />
              <div className='flex flex-row gap-4'>
                <Button onClick={() => handleViewChange(item.participantId, item.jobId)} className='h-[30px] bg-green-700 text-white'>View</Button>
                <Button className='h-[30px] bg-green-700 text-white' href={item.link}>Start Meeting</Button>
                <Button onClick={() => moveToNextStage(item?.participantId)} className='h-[30px] bg-green-700 text-white'>{loading ? <CircularProgress thickness={3} className='text-white' /> : <p>Move to next stage</p>}</Button>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    ))
  }

  const moveToNextStage = (id: string) => {
    setLoading(true);
    const body = {
      id: id,
      stage: "3",
    };
    axios.post("http://localhost:5048/stage", body).then(
      (res: AxiosResponse) => {
        setLoading(false);
        // handleStatusChange(res.data.code);
        console.log(res.data)
        if (res.data.code == 200) {
          setStatus({
            open: true,
            topic: "Successful",
            content: res.data.message
          })
        }
        else if(res.data.code) {
          setStatus({
            open: true,
            topic: "Unsuccessful",
            content: res.data.message
          })
        }
      }
    ).catch((err: AxiosError) => {
      console.log(err.message)
      setLoading(false)
    });
  };

  const clearStatus = () => setStatus({open: false})

  return (
    <div>
      <Modal className="flex justify-center" open={status?.open ? true : false} onClose={clearStatus}>
        <Notifier topic={status?.topic ?? ""} content={status?.content ?? ""} close={clearStatus}  />
      </Modal>
      <Paper className={!viewing ? "md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed capitalize" : "md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[97%] capitalize"}>
        {!viewing && (
          <div>
            <div className='mb-6 text-[]'>
          <p>
            Pending Interviews
          </p>
        </div>
        <div className='flex flex-row justify-between'>
        <FormControl>
            <InputLabel className="text-sm" id="demo-simple-select-label">
            Role
            </InputLabel>
          <Select
          value={roleId}
          onChange={handleUnitChange}
          className="w-[170px] text-black bg-white h-[50px]"
          label="Experience"
          placeholder="Experience"
          size="small"
          >{roles?.map((item: Role) => (
            <MenuItem className='text-black' value={item.id}>{item.name}</MenuItem>
          ))}
          </Select>
          </FormControl>
          <IconButton onClick={() => setRoleId("all")} className='bg-white w-[60px] h-[50px] rounded-sm'>
            <RefreshIcon className='text-green-700' />
          </IconButton>
        </div>
        <Divider variant='fullWidth' className='bg-green-700 h-[2px] mt-2' />
        <div className='overflow-y-auto h-[400px]'>
          {renderMeetings()}
        </div>
          </div>
        )}
        {viewing && (
            <div className='static'>
              <Applicant close={exitView} data={candidate as Candidate} role={role as Role} />
            </div>
        )}
      </Paper>
    </div>
  )
}