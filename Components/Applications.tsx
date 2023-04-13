import React, { useState, useEffect } from 'react'
import { Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Divider, IconButton, Input, Dialog } from '@mui/material'
import Axios, { AxiosError, AxiosResponse } from 'axios'
import { Candidate } from '../types/candidate'
import { Role } from '../types/roles'
import MenuIcon from '@mui/icons-material/Menu';
import { Applicant } from './applicant'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh';
import { getCandidate } from '../store/slices/candidateSlice'

export const Applications = () => {
    const [id, setId] = useState<string>("");
    const [candidates, setCandidates] = useState<Candidate[]>();
    const [roles, setRoles] = useState<Role[]>();
    const [viewing, setViewing] = useState<boolean>(false);
    const [applicant, setApplicant] = useState<Candidate>();
    const [roleName, setRoleName] = useState<{[key: string]: string}>({});
    const [searchVal, setSearchVal] = useState<string>('');
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [skillForms, setSkillForms] = useState<string[]>([]);
    const [filter, setFilter] = useState<string>("Date");
    const [flag, setFlag] = useState<string>('');
    const [role, setRole] = useState<Role>({
      name: '',
      deadline: '',
      description: '',
      experience: 0,
      id: '',
      salary: '',
      status: '',
      unit: ''
    });

    const getApplicants = () => {
      setFlag("");
      setFilter("");
      setSearchVal("")
      Axios.get(`http://localhost:5048/api/Candidate/role/${id}`).then((res) => {
          setCandidates(res.data.data);
        })
        .catch((e: AxiosError) => {
          console.log(e.message)
        });
    }

    useEffect(() => {
        getApplicants()
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
        setId(event.target.value as string);

        var item: Role = roles?.find((item: Role) => item.id == event.target.value) as Role;

        setRole(item)
      };

      const handleFilterChange = (event: SelectChangeEvent) => {
        
        setFilter(event.target.value);

        if(event.target.value == "Status") {
          let update = candidates?.sort((a, b) => (a.status == 'Pending') ? -1 : 1);
          setCandidates(update)
        }
        else if(event.target.value == "Stage") {
          let update = candidates?.sort((a, b) => (parseInt(a.stage as string) > parseInt(b.stage as string)) ? -1 : 1)
          setCandidates(update)
        }
        else if(event.target.value == "Date") {
          let update = candidates?.sort((a, b) => {
            var dateA = new Date(a.applDate as string).getTime() as number
            var dateB = new Date(b.applDate as string).getTime() as number

            return dateB - dateA
          })
          setCandidates(update);
        }
      }

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

      const handleSkillFormChange = (e: any, index: number) => {
        const update = skillForms?.map((item, idx) => {
          if(idx == index) {
            item = e.target.value;
          }
          return item;
        })

      setSkillForms(update);
      }

      const renderSkillForm = () => {
        return skillForms.map((item: string, idx: number) => (
          <div>
            <Input
            value={item}
            onChange={(e) => handleSkillFormChange(e, idx)}
            placeholder="Skill"
            className='p-1 bg-white h-[30px] w-[100px]'
            />
          </div>
        ))
      }

      const addSkillForm = () => {
        var update = ""
        setSkillForms([...skillForms, update]);
      }

      const displayCandidates = () => {
        return candidates?.filter((item: Candidate) => (item.lastName).toLowerCase().includes(searchVal?.toLowerCase()))
        .map((candidate: Candidate, idx) => (
            <div key={idx} className='bg-white w-[100%] h-[40px] mt-3 flex flex-row rounded-md p-2 justify-between justify-items-center'>
              <div className='flex flex-row gap-4 text-green-700 w-[180px] justify-between'>
              <div className='flex flex-row gap-1'>
              <p className='text-black'>firstname:</p><p className='text-ellipsis overflow-hidden'>{candidate.firstName}</p>
              </div>
              <div className='flex flex-row gap-1'>
              <p className='text-black'>lastname:</p><p className='text-ellipsis overflow-hidden'>{candidate.lastName}</p>
              </div>
              </div>
              <div className='flex flex-row w-[60%] justify-between'>
              <div className='flex flex-row gap-1 justify-items-center justify-between '>
                      <p>Applied: </p> <p className='text-green-700'>{candidate.applDate?.split('T')[0]}</p>
                  </div>
                  <div className='flex flex-row gap-1 justify-items-center justify-between '>
                      <p>stage: </p> <p className='text-green-700'>{candidate.stage}</p>
                  </div>
                  <div className='flex flex-row gap-1 justify-items-center justify-between '>
                      <p>status: </p> <p className='text-green-700'>{candidate.status}</p>
                  </div>
  
                  <IconButton onClick={() => handleViewChange(candidate)}>
                      <MenuIcon className='text-green-700' />
                  </IconButton>
                </div>
            </div>
          ))
      }

      const filterFields = [
        "Status",
        "Stage",
        "Date"
      ]

      const flags: {[key: string]: string}[] = [
        {
          name: "Maybe",
          value: "maybe"
        },
        {
          name: "Not Fit",
          value: "notFit"
        },
        {
          name: "Best Fit",
          value: "bestFit"
        },
      ]

      const handleFlagChange = (e: SelectChangeEvent) => {
        setFlag(e.target.value);
        var body = {
          roleId: id,
          flag: e.target.value
        }
        Axios.post("http://localhost:5048/api/Candidate/flag/candidates", body)
        .then((res: AxiosResponse) => {
          console.log(res.data)
          if(res.data.code == 200) {
            setCandidates(res.data.data);
          }
        })
        .catch((e: AxiosError) => {
          console.log(e.message);
        })
      }
      
  return (
    <div>
      <Dialog open={false}>
        <div className='h-[400px] w-[400px]'>
          <div className='p-4'>
            <p className='text-xl font-semibold'>
              Advanced Search
            </p>
          </div>
            <IconButton onClick={addSkillForm}>
              <p>
                Add Skill
              </p>
              <AddIcon />
            </IconButton>
            {renderSkillForm()}
        </div>
      </Dialog>
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
          <FormControl>
            <InputLabel className="text-sm" id="demo-simple-select-label">
            by Flag
            </InputLabel>
          <Select
          value={flag}
          onChange={handleFlagChange}
          className="w-[170px] text-black bg-white h-[50px]"
          label="Experience"
          placeholder="Experience"
          size="small"
          >{flags?.map((item: {[key: string]: string}, idx: number) => (
            <MenuItem key={idx} className='text-black' value={item.value}>{item.name}</MenuItem>
          ))}
          </Select>
          </FormControl>
          <FormControl>
            <InputLabel className="text-sm" id="demo-simple-select-label">
            Sort by
            </InputLabel>
          <Select
          value={filter}
          onChange={handleFilterChange}
          className="w-[170px] text-black bg-white h-[50px]"
          label="Experience"
          placeholder="Experience"
          size="small"
          >{filterFields?.map((item: string) => (
            <MenuItem className='text-black' value={item}>{item}</MenuItem>
          ))}
          </Select>
          </FormControl>
          <IconButton onClick={getApplicants} className='bg-white w-[60px] h-[50px] rounded-sm'>
            <RefreshIcon className='text-green-700' />
          </IconButton>
          <Input
          value={searchVal}
          onChange={handleSearch}
          placeholder='Search by Lastname'
          className='bg-white rounded-md p-2 md:w-[200px]'
          />
          <div className='flex flex-row text-[18px] mt-2 font-semibold'>
            <p>
              Total Applications:
            </p>
            <p className='text-green-700'>
              {candidates?.length}
            </p>
          </div>
        </div>
          <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-4" />
        <div className='overflow-y-auto md:h-[350px]'>
          {displayCandidates()}
        </div>
            </div>
        )}
        {viewing && (
            <div className='static'>
              <Applicant close={exitView} data={applicant as Candidate} role={role} />
            </div>
        )}
        </Paper>
    </div>
  )
}
