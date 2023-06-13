import React, { useState, useEffect } from 'react'
import { Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Divider, IconButton, Input, Dialog, Table, TableHead, TableBody , TableContainer, TableRow, TableCell , Button, CircularProgress, Modal } from "@mui/material"
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Candidate } from '../types/candidate';
import { Role } from '../types/roles';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Applicant } from './applicant';
import { Notifier } from './notifier';

export const Finalists = () => {
    const [candidates, setCandidates] = useState<Candidate[]>();
    const [roles, setRoles] = useState<Role[]>();
    const [roleId, setRoleId] = useState<string>("All");
    const [selctCandidate, setSelctCandidate] = useState<Candidate>();
    const [modalOpen, setModalOpen] = useState<string>("");
    const [viewing, setViewing] = useState<boolean>(false);
    const [role, setRole] = useState<Role>();
    const [tempId, setTempId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchVal, setSearchVal] = useState<string>("");
    const [status, setStatus] = useState<{ [key: string]: any }>({
      open: false,
    });
    
    const [metaData, setMetadata] = useState<{[key: string]: any}>({
      rank: "",
      reportTo: "",
      location: "",
      startDate: "",
      salary: "",
      city: "",
      salWords: ""
    });

    //* gets all active roles
    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_GET_ACTIVE_ROLES as string).then((res: AxiosResponse) => {
          setRoles(res.data.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    //* gets all candidates in the final stage
    const getCandidates = () => {
      let body = {
        stage: "3",
        roleId
    }
    axios.post(process.env.NEXT_PUBLIC_GET_CANDIDATE_BY_STAGE as string, body)
    .then((res: AxiosResponse) => {
      console.log(res.data)
        if(res.data.code == 200) {
            setCandidates(res.data.data);
        }
    })
    }

    useEffect(() => {
        getCandidates()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleId])

    //* exits the candidate info view
    const exitView = () => {
      setViewing(false)
    }

    //* deprecated may be taken out
      const handleUnitChange = (event: SelectChangeEvent) => {
        setRoleId(event.target.value as string);
        var item: Role = roles?.find((item: Role) => item.id == event.target.value) as Role;
      };

      const handleCandidateSelc = (item: Candidate) => {
        setSelctCandidate(item);
        setModalOpen("applicant");
      }

      //* hires a candidate
      const hireCandidate = () => {
        // console.log(metaData)
        if(selctCandidate?.status != "Hired") {
          setLoading(true);
          let body = {
            ...metaData,
            id:selctCandidate?.id
          }
          axios.post(process.env.NEXT_PUBLIC_HIRE_CANDIDATE as string, body)
          .then((res: AxiosResponse) => {
            if(res.data.code == 200) {
              setTempId(res.data.data);
              setLoading(false);
              setStatus({
                open: true,
                topic: "Successful",
                content: res.data.message,
                hasNext: false,
              });
              closeModal()
            }
          })
          .catch((err: AxiosError) => {
            setLoading(false);
            console.log(err.message)
            console.log(err.cause);
            setStatus({
              open: true,
              topic: "Unsuccessful",
              content: err.message,
              hasNext: false,
            });
          })
        }
      }

      //* renders the candidates
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

      const clearStatus = () => setStatus({ open: false });

      //* gets the selected candidate and switches the view to their personal information
      const handleViewChange = () => {
        let body = {
          id: selctCandidate?.id
        }
        axios.post(process.env.NEXT_PUBLIC_GET_CANDIDATE_BY_ID as string, body)
        .then((res: AxiosResponse) => {
          if(res.data.code == 200) {
            setSelctCandidate(res.data.data[0]);
            let role = roles?.find((item: Role) => item.id == res.data.data[0]?.roleId);
            setRole(role);
            setModalOpen("");
            setViewing(true);
          }
        })
      }

      //* closes the modal
    const closeModal = () => {
      setTempId(null);
      setModalOpen("");
    }

    //* searches for a candidate
    const handleSearch = (e: any) => {
      setSearchVal(e.target.value)
    }

    //* refreshes the list
    const refresh = () => {
      setRoleId("All");
      getCandidates();
    }

    const handleMetaChange = (key: string, e: any) => {
      let update = { ...metaData }
      if(key == "salary") {
        const regex = /^[0-9\b]+$/;
        if (e.target.value === "" || regex.test(e.target.value)) {
          update[key] = e.target.value
          setMetadata(update)
        }
      } else if(key == "salary") {
        return
      }
      else {
        update[key] = e.target.value
        setMetadata(update)
      }
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
      <Modal className='flex justify-center' open={modalOpen == "applicant" ? true : false} onClose={closeModal}>
        <div className='bg-slate-100 p-6 w-[500px] h-[200px] mt-[60px] rounded-md'>
          <div>

          </div>
          <div className='flex flex-row justify-between'>
            <Button onClick={handleViewChange} className='bg-green-700 h-[40px] text-white'>
              <p>View Candidate</p>
            </Button>
            <Button disabled={selctCandidate?.status == "Pending" ? false : true} onClick={() => setModalOpen("hire")} className={selctCandidate?.status == "Pending" ? 'bg-green-700 h-[40px] text-white' : 'bg-slate-400 h-[40px] text-white'}>
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
      <Modal className='flex justify-center' open={modalOpen == "hire" ? true : false} onClose={closeModal}>
        <div className='bg-slate-100 p-6 w-[550px] h-[430px] mt-[60px] rounded-md'>
            <div>
              <p>
                Acceptance information
              </p>
            </div>
            <div className='flex flex-row justify-between mt-6'>
            <Input
                value={metaData.city}
                onChange={(e) => handleMetaChange("city", e)}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='city'
              />

              <Input
                value={metaData.rank}
                onChange={(e) => handleMetaChange("rank", e)}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='rank'
              />
            </div>
            <div className='flex flex-row justify-between mt-6'>
              <Input
                value={metaData.reportTo}
                onChange={(e) => handleMetaChange("reportTo", e)}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='report to'
              />

              <Input
                value={metaData.location}
                onChange={(e) => handleMetaChange("location", e)}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='location'
              />
            </div>
            <div className='flex flex-row justify-between mt-6'>
              <Input
                value={metaData.startDate}
                onChange={(e) => handleMetaChange("startDate", e)}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='start date'
                type='date'
              />

              <Input
                value={metaData.salary}
                onChange={(e) => handleMetaChange("salary", e)}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='salary'
              />
                
            </div>

            <div className='flex flex-row justify-between mt-6'>
            <Input
                value={metaData.salWords}
                onChange={(e) => handleMetaChange("salWords", e)}
                className="bg-white h-[40px] w-[100%] px-2"
                placeholder='salary in words'
              />
            </div>

            <div className='flex justify-center mt-8'>
              <Button onClick={hireCandidate} className='bg-green-700 h-[50px] w-[400px] text-white capitalize'>
                {loading ? <CircularProgress className='w-[30px] h-[30px] text-white' thickness={7} /> : <p>Hire candidate</p>}
              </Button>
            </div>
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
 >{roles?.map((item: Role, idx: number) => (
   <MenuItem key={idx} className='text-black' value={item.id}>{item.name}</MenuItem>
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