import React, { useState, useEffect, useRef } from "react";
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
  Dialog,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableFooter,
  CircularProgress,
  Popover,
  Typography,
  Button,
  Menu,
} from "@mui/material";
import Axios, { AxiosError, AxiosResponse } from "axios";
import { Candidate } from "../types/candidate";
import { Role } from "../types/roles";
import { Applicant } from "./applicant";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { CustomInput } from "./customInput";
import { CustomMenu } from "./customMenu";
import { postAsync } from "../helpers/connection";


export const Applications = () => {
  const [id, setId] = useState<string>("");
  const [candidates, setCandidates] = useState<Candidate[]>();
  const [roles, setRoles] = useState<Role[]>();
  const [viewing, setViewing] = useState<boolean>(false);
  const [applicant, setApplicant] = useState<Candidate>();
  const [searchVal, setSearchVal] = useState<string>("");
  const [skillForms, setSkillForms] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("Date");
  const [flag, setFlag] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [dataCount, setDataCount] = useState<number>(0);
  const [take, setTake] = useState<number>(10);
  const [role, setRole] = useState<Role>({
    name: "",
    deadline: "",
    description: "",
    experience: 0,
    id: "",
    salary: "",
    status: "",
    unit: "",
  });
  const [menuOpen, setMenuOpen] = useState<{[key: string]: any}>({
    open: false,
    field: []
  })
  const [filterOpen, setFilterOpen] = useState<boolean>(false)

  const anchorRef = useRef(null);

  const handleClose = () => {
    // setPopperOpen({open: false, fields: ""})
  };

  // useEffect(() => {
  //   if(!popperOpen.open) {
  //     setFilterOpen(false)
  //   }
  //   console.log("that ran")
  // },[popperOpen.open])

  const openFilters = () => setFilterOpen(true);

  // const closeFilters = () => popperOpen.open ? setFilterOpen(false) : null;
  const closeFilters = () => {
    // setFilterOpen(false)
  }

  //* fetches all applicants by job role
  const getApplicants = (nextPage?: number, take?: number, jobId?: string) => {
    setFlag("");
    setFilter("");
    setSearchVal("");
    let body = {
      id: jobId ?? id,
      page: nextPage,
      take
    }
    postAsync(
      "getCandidatesByJob", body
    )
      .then((res) => {
        // console.log(res.data)
        setCandidates(res.data);
        setDataCount(res.count);
      })
      .catch((e: AxiosError) => {
        console.log(e.message);
        console.log(e.cause)
      });
  };

  useEffect(() => {
    getApplicants(page, take);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //* gets all active job roles
  useEffect(() => {
    let body = {
      value: "",
      page: 0,
    }
    postAsync(
      "getJobRoles", body).then((res) => {
      setRoles(res.data);
    });
  }, []);

  //* deprecated code unit implementation not active
  const units: string[] = [
    "Finance",
    "Networking",
    "Audit",
    "Legal",
    "Maintainance",
    "It",
  ];

  const refreshList = () => {
    setId("")
    getApplicants(page, take, "")
  }

  //* changes the unit
  const handleUnitChange = (event: SelectChangeEvent) => {
    setId(event.target.value as string);

    var item: Role = roles?.find(
      (item: Role) => item.id == event.target.value
    ) as Role;

    setRole(item);
  };

  //* filters the list based on conditions
  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
    if (event.target.value == "Status") {
      let update = candidates?.sort((a, b) => (a.status == "Pending" ? -1 : 1));
      setCandidates(update);
    } else if (event.target.value == "Stage") {
      let update = candidates?.sort((a, b) =>
        parseInt(a.stage as string) > parseInt(b.stage as string) ? -1 : 1
      );
      setCandidates(update);
    } else if (event.target.value == "Date") {
      let update = candidates?.sort((a, b) => {
        var dateA = new Date(a.appldate as string).getTime() as number;
        var dateB = new Date(b.appldate as string).getTime() as number;

        return dateB - dateA;
      });
      setCandidates(update);
    }
    // let value = event.target.value;
    // let field = filterFields.find((item) => item.value == value);
    // console.log("it changed")
    // console.log(field)
    // event.stopPropagation();
    // event.preventDefault()
    // setPopperOpen({open: true, fields: field.nested ? field.nestedFields : null});
  };

  //* switches the view to the applicants information
  const handleViewChange = (candidate: Candidate) => {
    var item: Role = roles?.find(
      (item: Role) => item.id == candidate?.roleid
    ) as Role;
    setRole(item);
    setApplicant(candidate);
    setViewing(true);
  };

  //* exits the applicant information
  const exitView = () => {
    setViewing(false);
  };

  //* search for a candidate
  const handleSearch = (e: any) => {
    setSearchVal(e.target.value);
  };

  //* deprecated may remove
  const handleSkillFormChange = (e: any, index: number) => {
    const update = skillForms?.map((item, idx) => {
      if (idx == index) {
        item = e.target.value;
      }
      return item;
    });

    setSkillForms(update);
  };

  const renderSkillForm = () => {
    return skillForms.map((item: string, idx: number) => (
      <div key={idx}>
        <Input
          value={item}
          onChange={(e) => handleSkillFormChange(e, idx)}
          placeholder="Skill"
          className="p-1 bg-white h-[30px] w-[100px]"
        />
      </div>
    ));
  };

  const addSkillForm = () => {
    var update = "";
    setSkillForms([...skillForms, update]);
  };

  //* renders the candidates
  const displayCandidates = () => {
    return candidates
      ?.filter((item: Candidate) =>
        item?.lastname.toLowerCase().includes(searchVal?.toLowerCase())
      )
      .map((candidate: Candidate, idx) => (
        <TableRow
      key={idx}
      hover
      role="checkbox"
      tabIndex={-1}
      className=""
      onClick={() => handleViewChange(candidate)}
    >
      <TableCell className="">{candidate?.firstname}</TableCell>
      <TableCell className="">{candidate?.lastname}</TableCell>
      <TableCell className="">
        {candidate.appldate?.split("T")[0]}
      </TableCell>
      <TableCell className="">{candidate.stage}</TableCell>
      <TableCell className="">{candidate.status}</TableCell>
    </TableRow>
      ));
  };

  //* goes to the next page of candidates
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    value: number
  ) => {
    setPage(value);
    getApplicants(value, take);
  };

  //* fields for filtering candidates
  const filterFields = ["Status", "Stage", "Date"];

  // const filterFields = [
  //   {
  //     value: "Status",
  //     nested: true,
  //     nestedFields: [
  //       "Status",
  //       "Pending",
  //       "Canceled",
  //       "Hired"
  //     ]
  //   },
  //   {
  //     value: "Stage",
  //     nested: true,
  //     nestedFields: [
  //       "Stage",
  //       "1",
  //       "2",
  //       "3"
  //     ]
  //   },
  //   {
  //     value: "Date",
  //     nested: false,
  //     // nestedFields: [
  //     //   "Pending",
  //     //   "Canceled",
  //     //   "Hired"
  //     // ]
  //   }
  // ]

  //* candidate application flags
  const flags: { [key: string]: string }[] = [
    {
      name: "Maybe",
      value: "maybe",
    },
    {
      name: "Not Fit",
      value: "notFit",
    },
    {
      name: "Best Fit",
      value: "bestFit",
    },
  ];

  //* flags a candidate
  const handleFlagChange = (e: SelectChangeEvent) => {
    setFlag(e.target.value);
    var body = {
      roleId: id,
      flag: e.target.value,
    };
    postAsync("getByFlag", body)
      .then((res) => {
        if (res.code == 200) {
          setCandidates(res.data);
        }
      })
      .catch((e: AxiosError) => {
        console.log(e.message);
      });
  };

  //* sets the take of candidates to show per page
  const handleTakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var takeVal = parseInt(e.target.value);
    setTake(takeVal);
    getApplicants(page, takeVal);
  };

  const handleFilter = () => {

  }

  return (
    <div>
      {/* <Popover
        // id={popperId}
        open={popperOpen.open}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        // transformOrigin={{
        //   vertical: 'top',
        //   horizontal: 'left',
        // }}
        onClose={handleClose}
      >
        <div className="flex justify-center">
          {popperOpen.fields?.map((item: string, idx: number) => (
            <Button key={idx} value={item}>
              {item}
            </Button>
          ))}
        </div>
      </Popover> */}
      <Dialog open={false}>
        <div className="h-[400px] w-[400px]">
          <div className="p-4">
            <p className="text-xl font-semibold">Advanced Search</p>
          </div>
          <IconButton onClick={addSkillForm}>
            <p>Add Skill</p>
            <AddIcon />
          </IconButton>
          {renderSkillForm()}
        </div>
      </Dialog>
      <Paper className=" md:h-[100%] bg-slate-100 p-6 align-middle md:mt-[30px] w-[97%]">
        {!viewing && (
          <div>
            <div className="flex flex-row">
              <p className="text-2xl h-[40px] mb-4">Applications</p>
            </div>
            <div className="flex flex-row justify-items-center justify-between">
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
                >
                  {roles ? roles.map((item: Role, idx: number) => (
                    <MenuItem key={idx} className="text-black" value={item.id}>
                      {item.name}
                    </MenuItem>
                  )) : <div className="flex justify-center">
                      <CircularProgress className="w-[30px] h-[30px] text-green-700" />
                    </div>}
                  
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel className="text-sm" id="demo-simple-select-label">
                  by Flag
                </InputLabel>
                <Select
                  // disabled={id == "" ? true : false}
                  value={flag}
                  onChange={handleFlagChange}
                  className="w-[170px] text-black bg-white h-[50px]"
                  label="Experience"
                  placeholder="Experience"
                  size="small"
                >
                  {flags?.map(
                    (item: { [key: string]: string }, idx: number) => (
                      <MenuItem
                        key={idx}
                        className="text-black"
                        value={item.value}
                      >
                        {item.name}
                      </MenuItem>
                    )
                  )}
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
                  // open={filterOpen}
                  // onOpen={openFilters}
                  // onClose={closeFilters}
                >{filterFields?.map((item: string, idx: number) => (
                  <MenuItem value={item} key={idx}>
                    {item}
                  </MenuItem>
                ))}
                </Select>
              </FormControl>
              <IconButton
                onClick={refreshList}
                className="bg-white w-[60px] h-[50px] rounded-sm flex flex-col"
              >
                <p className="text-[11px]">Refresh</p>
                <RefreshIcon className="text-green-700" />
              </IconButton>
              <Input
                value={searchVal}
                onChange={handleSearch}
                placeholder="Search by Lastname"
                className="bg-white rounded-md p-2 md:w-[200px]"
              />
              <div className="flex flex-row text-[18px] mt-2 font-semibold">
                <p>Total Applications:</p>
                <p className="text-green-700">{dataCount}</p>
              </div>
            </div>
            <Divider
              variant="fullWidth"
              className="bg-green-700 h-[2px] mt-4"
            />
            <TableContainer className="overflow-y-auto">
              <Table stickyHeader className="">
                <TableHead sx={{ display: "table-header-group" }}>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Application Date</TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{displayCandidates()}</TableBody>
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
        )}
        {viewing && (
          <div className="">
            <Applicant
              close={exitView}
              data={applicant as Candidate}
              role={role}
            />
          </div>
        )}
      </Paper>
    </div>
  );
};
