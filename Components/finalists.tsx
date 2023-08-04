import React, { useState, useEffect } from 'react'
import { Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Divider, IconButton, Input, Dialog, Table, TableHead, TableBody , TableContainer, TableRow, TableCell , Button, CircularProgress, Modal, ToggleButton, FormControlLabel, Checkbox, TableFooter, TablePagination } from "@mui/material"
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Candidate } from '../types/candidate';
import { Role } from '../types/roles';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Applicant } from './applicant';
import { Notifier } from './notifier';
import { Formik } from 'formik';
import { AcceptanceInfoValidation } from '../helpers/validation';

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
    const [sendMail, setSendMail] = useState<boolean>(false);
    const [selRole, setSelRole] = useState<Role>()
    const [status, setStatus] = useState<{ [key: string]: any }>({
      open: false,
    });
    const [inputType, setInputType] = useState<string>("text");
    const [dataCount, setDataCount] = useState<number>();
    const [page, setPage] = useState<number>(0);
    const [take, setTake] = useState<number>(10)
    const [location, setLocation] = useState<string>(selRole?.location)
    
    const [metaData, setMetadata] = useState<{[key: string]: any}>({
      rank: "",
      reportTo: "",
      location: "",
      startDate: "",
      salary: "",
      city: "",
      salWords: "",
      sendMail: false
    });

    const locations = [
      "Abia",
      "Adamawa",
      "Akwa Ibom",
      "Anambra",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross River",
      "Delta",
      "Ebonyi",
      "Edo",
      "Ekiti",
      "Enugu",
      "FCT - Abuja",
      "Gombe",
      "Imo",
      "Jigawa",
      "Kaduna",
      "Kano",
      "Katsina",
      "Kebbi",
      "Kogi",
      "Kwara",
      "Lagos",
      "Nasarawa",
      "Niger",
      "Ogun",
      "Ondo",
      "Osun",
      "Oyo",
      "Plateau",
      "Rivers",
      "Sokoto",
      "Taraba",
      "Yobe",
      "Zamfara",
    ];

    const changeLocation = (e: any) => {
      // setLocation(e.target.value)
      let update = { ...selRole, location: e.target.value}
      setSelRole(update)
    }

    //* gets all active roles
    useEffect(() => {
      let body = {
        value: "",
        page: 0,
      }
        axios.post(process.env.NEXT_PUBLIC_GET_JOB_ROLES as string, body).then((res: AxiosResponse) => {
          setRoles(res.data.data);
        }).catch((err: AxiosError) => {
          console.log(err.message)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    //* gets all candidates in the final stage
    const getCandidates = () => {
      let body = {
        stage: "3",
        roleId,
        page,
        take
    }
    // console.log(body)
    axios.post(process.env.NEXT_PUBLIC_GET_CANDIDATE_BY_STAGE as string, body)
    .then((res: AxiosResponse) => {
        if(res.data.code == 200) {
            setCandidates(res.data.data);
            setDataCount(res.data.count);
        }
    }).catch((err: AxiosError) => {
      console.log(err.message)
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
        let role = roles?.find((r: Role) => r.id == item.roleId);
        setSelRole(role);
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
      } else if(key == "sendMail") {
        update[key] = !update[key]
        setMetadata(update)
      }
      else {
        update[key] = e.target.value
        setMetadata(update)
      }
    }

    const handleTakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      var takeVal = parseInt(e.target.value);
      setTake(takeVal);
      getCandidates()
    };

    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      value: number
    ) => {
      setPage(value);
      getCandidates()
    };


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
        <div className='bg-slate-100 p-6 w-[550px] h-[70vh] mt-[60px] rounded-md'>
            <div>
              <p>
                Acceptance information
              </p>
            </div>
            <form>
              <Formik validationSchema={AcceptanceInfoValidation} initialValues={{state: selctCandidate?.state ?? "Lagos", reportTo: "", startDate: "", rank: "", salary: "", location: selRole?.location, salWords: ""}} onSubmit={(value) => {
                if(selctCandidate?.status != "Hired") {
                  setLoading(true);
                  let body = {
                    reportTo: value.reportTo,
                    city: value.state,
                    startDate: value.startDate,
                    rank: value.rank,
                    salary: value.salary.slice(0, 1) + "," + value.salary.slice(1),
                    location: value.location,
                    salWords: value.salWords,
                    sendMail: metaData?.sendMail,
                    id:selctCandidate?.id,
                    jobType: selRole.jobType
                  }
                  // console.log(body)
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
                
              }}>{({handleSubmit, handleChange, values, errors}) => (
                <div>
                  <div className='flex flex-row justify-between mt-6'>
            <FormControl>
              <InputLabel>
                State of residence
              </InputLabel>
            <Input
                value={values.state}
                onChange={handleChange("state")}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='city'
                readOnly
              />
              <div className="text-red-600 text-[10px] ml-4">
                {errors.state as any}
              </div>
            </FormControl>

              <FormControl>
              <InputLabel>
                Rank
              </InputLabel>
              <Input
                value={values.rank}
                onChange={handleChange("rank")}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='rank'
              />
              <div className="text-red-600 text-[10px] ml-4">
                {errors.rank as any}
              </div>
              </FormControl>
            </div>
            <div className='flex flex-row justify-between mt-6'>
              <FormControl>
              <InputLabel>
                Reports to
              </InputLabel>
              <Input
                value={values.reportTo}
                onChange={handleChange("reportTo")}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='report to'
              />
              <div className="text-red-600 text-[10px] ml-4">
                {errors.reportTo as any}
              </div>
              </FormControl>

              <FormControl>
              <InputLabel className=''>
                Location
              </InputLabel>
              {/* <Input
                value={values.location}
                onChange={handleChange("location")}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='location'
              />
              <div className="text-red-600 text-[10px] ml-4">
                {errors.location as any}
              </div> */}
              <Select
              value={selRole?.location}
              onChange={changeLocation}
              className="bg-white h-[40px] w-[240px] px-2 mt-[15px]"
              >
                {locations.map((item: string, idx: number) => (
                  <MenuItem value={item} key={idx}>
                  {item}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
            </div>
            <div className='flex flex-row justify-between mt-6'>
              <FormControl>
              <InputLabel>
                Start date
              </InputLabel>
              <Input
                value={values.startDate}
                onChange={handleChange("startDate")}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder="start date"
                type={inputType}
                onFocus={() => setInputType("date")}
                onBlur={() => setInputType("text")}
              />
              <div className="text-red-600 text-[10px] ml-4">
                {errors.startDate as any}
              </div>
              </FormControl>

              <FormControl>
              <InputLabel>
                Salary
              </InputLabel>
              <Input
                value={values.salary}
                onChange={handleChange("salary")}
                className="bg-white h-[40px] w-[240px] px-2"
                placeholder='salary'
              />
              <div className="text-red-600 text-[10px] ml-4">
                {errors.salary as any}
              </div>
              </FormControl>
                
            </div>

            <div className='flex flex-row justify-between mt-6'>
              <FormControl className='w-[80%]'>
              <InputLabel>
                Salary in words
              </InputLabel>
              <Input
                  value={values?.salWords}
                  onChange={handleChange("salWords")}
                  className="bg-white h-[40px] w-[100%] px-2"
                  placeholder='salary in words'
                />
                <div className="text-red-600 text-[10px] ml-4">
                {errors.salWords as any}
              </div>
              </FormControl>

              <FormControlLabel
              className=''
                control={
                  <Checkbox
                    checked={metaData?.sendMail}
                    onChange={(e) => handleMetaChange("sendMail", e)}
                  />
                }
                classes={{
                  label: "text-[10px]"
                }}
                labelPlacement="start"
                label="Send Email"
              />
            </div>

            <div className='flex justify-center mt-8'>
              <Button onClick={handleSubmit as any} className='bg-green-700 h-[50px] w-[400px] text-white capitalize'>
                {loading ? <CircularProgress className='w-[30px] h-[30px] text-white' thickness={7} /> : <p>Hire candidate</p>}
              </Button>
            </div>
                </div>
              )}

              </Formik>
            </form>
            
        </div>

      </Modal>
      <Paper className={!viewing ? "md:h-[90vh] bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed" : "md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[97%]"}>
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
 >{roles ? roles?.map((item: Role, idx: number) => (
   <MenuItem key={idx} className='text-black' value={item.id}>{item.name}</MenuItem>
 )) : <div className="flex justify-center">
 <CircularProgress className="w-[30px] h-[30px] text-green-700" />
</div>}
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
 <IconButton onClick={refresh} className="bg-white w-[60px] h-[50px] rounded-sm flex flex-col">
 <p className="text-[11px]">Refresh</p>
   <RefreshIcon className='text-green-700' />
 </IconButton>
   </div>
   <Divider variant='fullWidth' className='bg-green-700 h-[2px] mt-2' />
   <div>
   <TableContainer className="overflow-y-auto">
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
     <TableFooter>
                  <TableRow>
                    <TablePagination
                      colSpan={6}
                      count={dataCount}
                      rowsPerPage={take}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          "aria-label": "rows per page",
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleTakeChange}
                    />
                  </TableRow>
                </TableFooter>
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