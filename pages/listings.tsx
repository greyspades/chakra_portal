import React, { useState, useEffect, useContext } from "react";
import Axios, { AxiosError } from "axios";
import {
  Button,
  Paper,
  Input,
  Divider,
  SelectChangeEvent,
  Modal,
  IconButton,
  Drawer
} from "@mui/material";
import { Role } from "../types/roles";
import LensIcon from "@mui/icons-material/Lens";
import { Application } from "../components/application";
import { Signup } from "../components/applicationStages/signup";
import { Navbar } from "../components/navbar";
import { MainContext } from "../context";
import { Notifier } from "../components/notifier";
import { JobFilters } from "../components/applicationStages/jobFilters";
import { JobList } from "../components/applicationStages/jobList";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getRole } from "../store/slices/roleSlice";
import CryptoJs from "crypto-js"
import { getContent, postAsync, postContent } from "../helpers/connection";
import { lowerKey, lowerKeyArray } from "../helpers/formating";


const Listings = ({ data }: any) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [activeRole, setActiveRole] = useState<Role>();
  const [step, setStep] = useState<number>(1);
  const [unit, setUnit] = useState<string | null>();
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [applying, setApplying] = useState<{ [key: string]: any }>({
    value: false
  });
  const [nav, setNav] = useState<string>("");
  const [status, setStatus] = useState<{[key: string]: any }>({
    open: false,
  });
  const [filter, setFilter] = useState<string>("")

  const [filterType, setFilterType] = useState<string>("")

  const [fields, setFields] = useState<{[key: string]: any}>({
    location: "",
    skill: "",
    degree: ""
  })
  const [jobType, setJobType] = useState<string>("")
  const [eduType, setEduType] = useState<string>("")

  const [set, setSet] = useState<boolean>(false)

  const [showFilter, setShowFilter] = useState<boolean>(true)
  const [roleCount, setRoleCount] = useState<number>(0)

  const [checkFields, setCheckFields] = useState<{[key: string]: any}>({
    bachelors: false,
    masters: false,
    phd: false,
    fullTime: false,
    partTime: false,
    internship: false,
    contract: false
  });

useEffect(() => {
if(window.innerWidth <= 400) {
  setIsMobile(true)
  setShowFilter(false)
}
},[])

const handleChange = (e: any, type: string) => {
  let update = { ...fields }
  update[type] = e.target.value
  setFields(update)
  if(e.target.value != null) {
    setFilter(e.target.value);
    setFilterType(type);
    getAllRoles(0, e.target.value, type)
  }
}

const handleJobTypeChange = (e: any) => {
  console.log(e.target.value)
  setJobType(e.target.value)
  getAllRoles(0, e.target.value, "JobType")
}

const handleEduTypeChange = (e: any) => {
  console.log(e.target.value)
  setEduType(e.target.value)
  getAllRoles(0, e.target.value, "Qualification")
}

const handleCheckChange = (filter: string, filterType: string) => {
  filter = filter.split(" ").join("")
  let update = { ...checkFields }
  if(!Object.values(checkFields).includes(true)) {
    update[filter] = !checkFields[filter]
    setCheckFields(update)
    if(update[filter] == true) {
      setSearchVal("")
      setFilter(filter);
      setFilterType(filterType);
      getAllRoles(0,filter,filterType)
    }
  }
}

  //* global context containing login state
  const { loggedIn, setLoggedIn } = useContext(MainContext) as any;

  const changeFilter = (value: string, type: string) => {
    setFilter(value);
    setFilterType(type);
  }

  const refreshJobsList = () => {
    setFilter("")
    setFilterType("")
    setSearchVal("")
    getAllRoles(0)
    window.scrollTo(0,0)
  }

  //* gets all active job roles
  const getAllRoles = async(pageVal: number, filterVal?: string, filterTypeVal?: string) => {
    let body = {
      value: searchVal,
      page: pageVal,
      filter: filterVal ?? "",
      filterType: filterTypeVal ?? ""
    }
    postAsync(process.env.NEXT_PUBLIC_GET_JOB_ROLES as string, body).then((res) => {
      let data = res.data;
      setRoles(data);
      setActiveRole(data[0]);
      setRoleCount(res.data?.count)
      setSet(true)
    }).catch((err: AxiosError) => {
      console.group(err.message)
    });
  };

  useEffect(() => {
    getAllRoles(0, "", "");

  }, [searchVal]);

  //* search for a job role
  const searchRole = (e: any) => {
    setSearchVal(e.target.value);
  };

  //* deprecated
  const handleUnitChange = (event: SelectChangeEvent) => {
    if (event.target.value == "All") {
      setUnit(null);
      getAllRoles(0);
    } else {
      setUnit(event.target.value as string);
    }
  };

  //* deprecated
  const units: string[] = [
    "Finance",
    "Networking",
    "Audit",
    "Legal",
    "Maintainance",
    "It",
    "All",
  ];

  //* selects a job role
  const handleRoleSelect = (role: Role) => {
    setActiveRole(role);

    setStep(1);
  };

  //* exits the job role application view
  const handleGoBack = () => {
    setStep(0);
  };

  //* toggles the job role application
  const handleApply = (data: Role) => {
    var user = sessionStorage.getItem("cred");
    if (user) {
      setActiveRole(data)
      setStep(2);
    } else {
      setApplying({
        value: true,
        source: "main",
      });
    }
  };

  //* deprecated will remove
  const login = () => {
    var user = sessionStorage.getItem("cred");
    if (!user) {
      setApplying({
        value: true,
        source: "nav",
      });
    }
  };

  //* deprecated will remove
  const logout = () => {
    sessionStorage.clear();
    setLoggedIn(false);
    setStep(1);
    clearStatus();
    // setStatus({
    //   open: true,
    //   topic: "Successful",
    //   content: "Logged Out Successfully"
    // })
  };

  //* displays the logout confirmation notifier
  const showLogout = () => {
    setStatus({
      open: true,
      topic: "Confirmation",
      content: "Are you sure you want to sign out",
      hasNext: true,
    });
  };

  //* toggles application from the navbar
  const handleNav = (item: string) => {
    setNav(item);
    setApplying({ value: true });
  };

  //* clears the notifier state
  const clearStatus = () => setStatus({ open: false });

  //* parses and maps through the job descriptions
  const parseDesc = (desc: string) => {
    return JSON.parse(desc).map(
      (item: { [key: string]: string }, idx: number) => (
        <div key={idx}>
          <div  className="flex flex-row gap-4 mt-2">
          <p>{item?.["RowNum~~Blnk"]}</p>
          <p className="capitalize">
            {item?.["Job responsibility~~Sentc"].toLowerCase()}
          </p>
        </div>
          <div>
            {/* <p className="capitalize">
              {item?.desc}
            </p> */}
          </div>
        </div>
      )
    );
  };

  // const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className="bg-slate-100">
      <Modal
        className="flex justify-center"
        open={status?.open ? true : false}
        onClose={clearStatus}
      >
        <Notifier
          hasNext={status.hasNext}
          topic={status?.topic ?? ""}
          content={status?.content ?? ""}
          close={clearStatus}
        />
      </Modal>
      <Modal
        onClose={() => setApplying({ value: false })}
        open={applying.value}
        className="flex justify-center"
      >
        <Signup
          login={true}
          exit={() => setApplying({ value: false })}
          next={() => (applying.source != "main" ? setStep(1) : setStep(2))}
          nextPage={nav == "status" ? "applicant" : ""}
        />
      </Modal>
      <Navbar handleNav={handleNav} next={() => setStep(1)} />
      <div className="mt-[60px] p-2">
      {!showFilter && step == 1 &&(
        <div className="flex flex-row justify-between shadow-md bg-white rounded-md p-4">
          <p className="text-xl font-semibold">All Jobs</p>
          <Button onClick={() => setShowFilter(true)} className="text-[12px] text-green-700">
            Show Filters
          </Button>
        </div>
      )}
      {step == 2 &&(
        <div className="bg-green-100 font-semibold text-xl w-[100%] md:h-[60px] h-[40px] justify-between flex flex-row md:p-4 p-2 fixed overflow-clip z-30">
          <p>
            {activeRole?.name}
          </p>
          <IconButton onClick={() => setStep(1)}>
            <ArrowBackIcon className="text-green-700" />
          </IconButton>
        </div>
      )}
      </div>
      <div className={step == 1 ? "md:grid md:grid-cols-7 md:gap-4 sm:flex sm:flex-col" : "md:grid md:grid-cols-7 sm:flex sm:flex-col md:gap-4 md:mt-[60px] mt-[40px] z-10"}>
          <div className={step == 1 ? "border-solid border-r-2 md:h-[100vh] bg-white md:col-span-2 self-start md:sticky top-[70px] md:grid" : "border-solid border-r-2 md:grid self-start md:sticky top-[70px] md:col-span-2"}>
            {step == 1 && showFilter ? <JobFilters
            fields={fields}
            change={handleChange}
            searchVal={searchVal}
            searchRole={searchRole}
            checkFields={checkFields}
            jobTypeChange={handleJobTypeChange}
            jobType={jobType}
            eduType={eduType}
            eduTypeChange={handleEduTypeChange}
            mobile={isMobile}
            hideFilter={() => setShowFilter(false)}
            /> : step == 2 && !isMobile ? <div className="sticky"><JobList roles={roles} setRole={setRoles} apply={handleApply} getRoles={getAllRoles} currentStep={step} refresh={refreshJobsList} count={roleCount} /></div> : <div></div>}
          </div>

          <div className="w-[100%] col-span-5 mt-4 md:mt-0">
            {step == 1 ? <JobList roles={roles} setRole={setRoles} apply={handleApply} getRoles={getAllRoles} currentStep={step} refresh={refreshJobsList} count={roleCount} /> : <div className="sticky self-start top-[70px]"><Application {...activeRole as Role} /></div>}
          </div>
      </div>
      <Drawer>

      </Drawer>
    </div>
  );
};

export default Listings;
