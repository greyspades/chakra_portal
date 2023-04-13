import React, { useState, useEffect} from 'react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Divider, IconButton, Input, Dialog, Accordion, AccordionDetails, AccordionSummary, Button } from "@mui/material"
import { Role } from '../../types/roles'
import { Candidate } from '../../types/candidate'
import { Meeting } from '../../types/meetings'
import { Applicant } from '../applicant'
import TodayIcon from '@mui/icons-material/Today';
import RefreshIcon from '@mui/icons-material/Refresh';

export const Schedule = () => {
  const [roles, setRoles] = useState<Role[]>();
  const [candidate, setCandidate] = useState<Candidate>();
  const [roleId, setRoleId] = useState<string>("all");
  const [role, setRole] = useState<Role>();
  const [meetings, setMeetings] = useState<Meeting[]>();
  const [viewing, setViewing] = useState<boolean>(false);

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
      return <TodayIcon className='text-green-700' />
    }
    else {
      return <TodayIcon className='text-orange-400' />
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
      <div className='mt-[10px]'>
        <Accordion>
          <AccordionSummary>
            <div className='flex flex-row gap-4 justify-between'>
              <div className='flex flex-row gap-1 w-[170px] text-ellipsis overflow-hidden ...'>role:<p className='text-green-700'>{item.jobTitle ?? "null"}</p></div>
              <div className='flex flex-row gap-1'>date:<p className='text-green-700'>{new Date(item.date.split("T")[0]).toLocaleDateString()}</p></div>
              <div className='flex flex-row gap-1'>time:<p className='text-green-700'>{item.time}</p></div>
              <div className='flex flex-row gap-1 w-[200px] text-ellipsis overflow-hidden ...'>firstname:<p className='text-green-700'>{item.firstName ?? "null"}</p></div>
              <div className='flex flex-row gap-1 w-[220px] text-ellipsis overflow-hidden ...'>lastname:<p className='text-green-700'>{item.lastName ?? "null"}</p></div>
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
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    ))
  }

  return (
    <div>
      <Paper className={!viewing ? "md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed" : "md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[97%]"}>
        {!viewing && (
          <div>
            <div>
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