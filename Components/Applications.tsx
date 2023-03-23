import React, { useState, useEffect } from 'react'
import { Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Divider, IconButton, Input } from '@mui/material'
import Axios, { AxiosError } from 'axios'
import { Candidate } from '../types/candidate'
import { Role } from '../types/roles'
import MenuIcon from '@mui/icons-material/Menu';
import { Applicant } from './applicant'

export const Applications = () => {
    const [id, setId] = useState<string>("");
    const [candidates, setCandidates] = useState<Candidate[]>();
    const [roles, setRoles] = useState<Role[]>();
    const [viewing, setViewing] = useState<boolean>(false);
    const [applicant, setApplicant] = useState<Candidate>();
    const [roleName, setRoleName] = useState<string>();
    const [searchVal, setSearchVal] = useState<string>('');

    useEffect(() => {
      console.log(id)
        Axios.get(`http://localhost:5048/api/Candidate/role/${id}`).then((res) => {
          setCandidates(res.data.data);
          console.log(res.data.data)
        })
        .catch((e: AxiosError) => {
          console.log(e.message)
        });
      }, [id]);

      useEffect(() => {
        Axios.get("http://localhost:5048/roles/Role").then((res) => {
          setRoles(res.data.data);
        });
      }, []);


    const units: string[] = [
        'Finance',
        'Networking',
        'Audit',
        'Legal',
        'Maintainance',
        'It'
      ]
    
      const handleUnitChange = (event: SelectChangeEvent) => {
        console.log(event.target.value)
        setId(event.target.value as string);
        var item = roles?.find((item: Role) => item.id == id) || null
        setRoleName(item?.name)
      };

      const handleViewChange = (candidate: Candidate) => {
        setApplicant(candidate)
        setViewing(true)
      }

      const exitView = () => {
        setViewing(false)
      }

      const handleSearch = (e: any) => {
        setSearchVal(e.target.value)
      }

      const displayCandidates = () => {
        return candidates?.filter((item: Candidate) => (item.lastName).toLowerCase().includes(searchVal?.toLowerCase()))
        .map((candidate: Candidate, idx) => (
            <div key={idx} className='bg-white w-[100%] h-[40px] mt-3 flex flex-row rounded-md p-2 justify-between justify-items-center'>
              <div className='flex flex-row text-green-700 w-[180px] justify-between'>
              <div>
              {candidate.firstName}
              </div>
              <div>
              {candidate.lastName}
              </div>
              </div>
              <div className='flex flex-row'>
                  <div className='flex flex-row mr-[70px] justify-items-center justify-between w-[60px]'>
                      <p>stage: </p> <p className='text-green-700'>{candidate.stage}</p>
                  </div>
                  <div className='flex flex-row mr-[70px] justify-items-center justify-between w-[110px]'>
                      <p>status: </p> <p className='text-green-700'>{candidate.status}</p>
                  </div>
  
                  <IconButton onClick={() => handleViewChange(candidate)}>
                      <MenuIcon className='text-green-700' />
                  </IconButton>
                </div>
            </div>
          ))
      }
      
  return (
    <div>
        <Paper className=" md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[97%]">
        {!viewing && (
            <div>
                <div className='flex flex-row'>
        <p className="text-2xl h-[40px]">Applications</p>
        </div>
        <div className='flex flex-row justify-items-center justify-between'>
        <FormControl>
            <InputLabel className="text-sm" id="demo-simple-select-label">
            Role
            </InputLabel>
          <Select
          value={id}
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
          <Input
          value={searchVal}
          onChange={handleSearch}
          placeholder='Search by Lastname'
          className='bg-white rounded-md p-2 md:w-[200px]'
          />
        </div>
          <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-4" />
        <div className='overflow-y-auto md:h-[350px]'>
          {displayCandidates()}
        </div>
            </div>
        )}
        {viewing && (
            <div className='static'>
              <Applicant close={exitView} data={applicant as Candidate} role={roleName as string} />
            </div>
        )}
        </Paper>
    </div>
  )
}
