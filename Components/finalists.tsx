import React, { useState, useEffect } from 'react'
import { Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Divider, IconButton, Input, Dialog, Table, TableHead, TableBody , TableContainer, TableRow, TableCell , Button, CircularProgress, Modal } from "@mui/material"
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Candidate } from '../types/candidate';
import { Role } from '../types/roles';
import TodayIcon from '@mui/icons-material/Today';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Applicant } from './applicant';

export const Finalists = () => {
    const [candidates, setCandidates] = useState<Candidate[]>();
    const [roles, setRoles] = useState<Role[]>();
    const [roleId, setRoleId] = useState<string>("All");
    const [selctCandidate, setSelctCandidate] = useState<Candidate>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [viewing, setViewing] = useState<boolean>(false);
    const [role, setRole] = useState<Role>();
    const [tempId, setTempId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchVal, setSearchVal] = useState<string>("");

    useEffect(() => {
        axios.get("http://localhost:5048/roles/Role").then((res: AxiosResponse) => {
          setRoles(res.data.data);
        });
      }, []);

    const getCandidates = () => {
      let body = {
        stage: "3",
        roleId
    }
    axios.post("http://localhost:5048/api/Candidate/stage", body)
    .then((res: AxiosResponse) => {
        console.log(res.data)
        if(res.data.code == 200) {
            setCandidates(res.data.data);
        }
    })
    }

    useEffect(() => {
        getCandidates()
    }, [roleId])

    const exitView = () => {
      setViewing(false)
    }



      const handleUnitChange = (event: SelectChangeEvent) => {
        console.log(event.target.value)
        setRoleId(event.target.value as string);
        var item: Role = roles?.find((item: Role) => item.id == event.target.value) as Role;
      };

      const handleCandidateSelc = (item: Candidate) => {
        setSelctCandidate(item);
        setModalOpen(true);
      }

      const hireCandidate = () => {
        if(selctCandidate?.status != "Hired") {
          setLoading(true);
          let body = {
            id:selctCandidate?.id
          }
          axios.post("http://localhost:5048/api/Candidate/hire", body)
          .then((res: AxiosResponse) => {
            if(res.data.code == 200) {
              setTempId(res.data.data);
              setLoading(false);
            }
          })
          .catch((err: AxiosError) => {
            setLoading(false);
            console.log(err.message)
          })
        }
      }

      const displayCandidates = () => {
        return candidates?.filter((item: Candidate) => item.lastName.toLowerCase().includes(searchVal?.toLowerCase() as string))
        .map((item: Candidate, idx: number) => (
          <TableRow
          key={idx}
          hover role="checkbox" tabIndex={-1}
          className = ""
          onClick={() => handleCandidateSelc(item)}
        >
          <TableCell className = "">
            {item?.firstName}
          </TableCell>
          <TableCell className = "">
            {item?.lastName}
          </TableCell>
          <TableCell className = "">
            {item.applDate?.split("T")[0]}
          </TableCell>
          <TableCell className = "">
            {item.stage}
          </TableCell>
          <TableCell className = "">
            {item.status}
          </TableCell>
          </TableRow>
        ))
      }

      const handleViewChange = () => {
        axios.get(`http://localhost:5048/api/Candidate/${selctCandidate?.id}`)
        .then((res: AxiosResponse) => {
          console.log(res.data)
          if(res.data.code == 200) {
            setSelctCandidate(res.data.data[0]);
            let role = roles?.find((item: Role) => item.id == res.data.data[0]?.roleId);
            setRole(role);
            setModalOpen(false)
            setViewing(true);
          }
        })
      }

    const closeModal = () => {
      setTempId(null);
      setModalOpen(false);
    }

    const handleSearch = (e: any) => {
      setSearchVal(e.target.value)
    }

    const refresh = () => {
      setRoleId("All");
      getCandidates();
    }


  return (
    <div>
      <Modal className='flex justify-center' open={modalOpen} onClose={closeModal}>
        <div className='bg-slate-100 p-6 w-[500px] h-[200px] mt-[60px] rounded-md'>
          <div>

          </div>
          <div className='flex flex-row justify-between'>
            <Button onClick={handleViewChange} className='bg-green-700 h-[40px] text-white'>
              <p>View Candidate</p>
            </Button>
            <Button onClick={hireCandidate} className='bg-green-700 h-[40px] text-white'>
              <p>Hire Candidate</p>
            </Button>
          </div>
          {
            loading && !tempId && (
              <div className='flex justify-center'>
                <CircularProgress thickness={6} className='text-green-700' />
              </div>
            )
          }
          {tempId && (
            <div className='mt-[40px] font-semibold'>
            <p>{selctCandidate?.firstName} {selctCandidate?.lastName} has successfully been hired with a temporary staff Id of {tempId}</p>
          </div>
          )}
        </div>
      </Modal>
      <Paper className={!viewing ? "md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed" : "md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[97%]"}>
            {!viewing && (
              <div>
                              <div>
   
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
 <FormControl className='mt-[-15px]'>
  <InputLabel>
    Search by lastname
  </InputLabel>
  <Input
    value={searchVal}
    placeholder="Search"
    onChange={handleSearch}
    className='w-[160px] h-[50px] bg-white'
  />
 </FormControl>
 <IconButton onClick={refresh} className='bg-white w-[60px] h-[50px] rounded-sm'>
   <RefreshIcon className='text-green-700' />
 </IconButton>
   </div>
   <Divider variant='fullWidth' className='bg-green-700 h-[2px] mt-2' />
   <div>
   <TableContainer className="overflow-y-auto md:h-[350px]">
     <Table stickyHeader className="">
     <TableHead sx={{ display: "table-header-group" }}>
   <TableRow>
   <TableCell>
     First Name
   </TableCell>
   <TableCell>
     Last Name
   </TableCell>
   <TableCell>
     Application Date
   </TableCell>
   <TableCell>
     Stage
   </TableCell>
   <TableCell>
     Status
   </TableCell>
   </TableRow>
 </TableHead>
 <TableBody className=''>
     {displayCandidates()}
     </TableBody>
     </Table>
   </TableContainer>
   </div>
              </div>
            )}
            {viewing && (
            <div className='static'>
              <Applicant close={exitView} data={selctCandidate as Candidate} role={role as Role} />
            </div>
        )}
           </Paper>
    </div>
  )
}