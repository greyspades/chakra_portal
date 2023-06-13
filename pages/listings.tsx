import React, { useState, useEffect, useContext } from "react";
import Axios, { AxiosError } from "axios";
import {
  Button,
  Paper,
  Input,
  Divider,
  SelectChangeEvent,
  Modal,
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

const Listings = ({ data }: any) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [activeRole, setActiveRole] = useState<Role>();
  const [step, setStep] = useState<number>(1);
  const [unit, setUnit] = useState<string | null>();
  const [applying, setApplying] = useState<{ [key: string]: any }>({
    value: false
  });
  const [nav, setNav] = useState<string>("");
  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });

  const [fields, setFields] = useState<{[key: string]: any}>({
    location: "",
    skill: "",
    degree: ""
  })
  const [checkFields, setCheckFields] = useState<{[key: string]: any}>({
    bachelors: false,
    masters: false,
    phd: false,
    fullTime: false,
    partTime: false,
    internship: false,
    contract: false
  });

const handleChange = (e: any, type: string) => {
  let update = { ...fields }
  update[type] = e.target.value
  setFields(update)
}

const handleCheckChange = (e: any, type: string) => {
  let update = { ...checkFields }
  update[type] = !checkFields[type]
  setCheckFields(update)
}

  //* global context containing login state
  const { loggedIn, setLoggedIn } = useContext(MainContext) as any;

  //* gets all active job roles
  const getAllRoles = () => {
    let body = {
      value: searchVal
    }
    Axios.post(process.env.NEXT_PUBLIC_GET_JOB_ROLES as string, body).then((res) => {
      console.log(res.data)
      setRoles(res.data.data);
      setActiveRole(res.data.data[0]);
    }).catch((err: AxiosError) => {
      console.group(err.message)
    });
  };

  useEffect(() => {
    getAllRoles();

  }, [searchVal]);

  // useEffect(() => {
  //   if(activeRole?.description) {
  //   let data = JSON.parse(activeRole?.description as string)
  //   console.log(data)
  //   }
  // }, [activeRole])

  // useEffect(() => {
  //   if (unit) {
  //     Axios.get(`http://localhost:8070/roles/Role/byUnit/${unit}`).then(
  //       (res) => {
  //         setRoles(res.data);
  //         console.log(res.data);
  //         // setActiveRole(res.data.data[0])
  //       }
  //     );
  //   }
  // }, [unit]);

  //* search for a job role
  const searchRole = (e: any) => {
    setSearchVal(e.target.value);
  };

  //* deprecated
  const handleUnitChange = (event: SelectChangeEvent) => {
    if (event.target.value == "All") {
      setUnit(null);
      getAllRoles();
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
  const handleApply = () => {
    var user = sessionStorage.getItem("cred");
    if (user) {
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
      <div className="flex flex-row mt-[80px] gap-8">
          <div className="w-[27%] border-solid border-r-2 h-[100vh] fixed bg-white flex">
            <JobFilters
            fields={fields}
            change={handleChange}
            searchVal={searchVal}
            searchRole={searchRole}
            checkFields={checkFields}
            checkChange={handleCheckChange}
            />
          </div>

          <div className="w-[100%] flex justify-end">
            <JobList roles={roles} setRole={setRoles} />
          </div>
      </div>









      {/* <div className="md:w-[97%] mt-[80px] flex gap-8 fixed capitalize">
        <div className=" w-[40%] pb-8">
          <div className="flex flex-col justify-center bg-green-700 h-[120px] p-3">
            <Input
              placeholder="Search for a job role"
              className="md:w-[100%] h-[40px] bg-slate-100 rounded-md p-2 md:mt-[10px]"
              value={searchVal}
              onChange={(e) => searchRole(e)}
            />
          </div>
          <ul className="static bg-slate-100 overflow-auto h-[75vh] pb-8 px-4">
            {roles
              .filter((item: Role) =>
                item.name.toLowerCase().includes(searchVal.toLowerCase())
              )
              .map((role: Role, index) => (
                <li key={index} className="flex justify-center w-[100%]">
                  <button
                    onClick={() => handleRoleSelect(role)}
                    className="mt-2"
                  >
                    <Paper
                      className={
                        activeRole != role
                          ? "p-2 w-[100%]"
                          : "p-2 w-[100%] bg-green-700 text-white"
                      }
                    >
                      {role.name}
                    </Paper>
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div className="grid col-span-2 md:w-[170%]">
          {activeRole && step == 1 && (
            <div>
              <Paper className=" h-[90vh] bg-slate-100 grid p-6 align-middle pb-0">
                <p className="text-3xl font-semibold flex flex-row w-[100%]">
                  {activeRole.name}
                  <LensIcon
                    className="mt-[13px] ml-2"
                    style={{ color: "green", width: 15, height: 15 }}
                  />
                </p>
                <div className="w-[100%] h-[250px] bg-white leading-relaxed overflow-y-scroll rounded-md p-4">
                  {parseDesc(activeRole.description as string)}
                </div>
                <Divider variant="fullWidth" className="bg-green-700 h-[2px]" />

                <div className="flex flex-row md:gap-10 mt-[-40px]">
                  <span className="flex gap-2 items-center h-[60px] content-center text-[18px]">
                    <p className="flex w-auto">Unit:</p>
                    <p className="text-green-700 justify-start font-semibold">
                      {activeRole.unit}
                    </p>
                  </span>

                  <span className="flex gap-2 items-center h-[60px] content-center text-[18px] ">
                    <p className="flex w-auto">Job location:</p>
                    <p className="flex text-green-700 justify-start font-semibold">
                      {activeRole?.location}
                    </p>
                  </span>

                  <span className="flex gap-2 items-center h-[60px] content-center text-[18px] ">
                    <p className="flex w-auto">Required Experience:</p>
                    <p className="flex text-green-700 justify-start font-semibold">
                      {activeRole.experience} years
                    </p>
                  </span>

                  <span className="flex gap-2 items-center h-[60px] content-center text-[18px] ">
                    <p className="flex w-auto">Application Deadline:</p>
                    <p className="flex text-green-700 justify-start font-semibold">
                      {activeRole?.deadline?.toString().split("T")[0]}
                    </p>
                  </span>
                </div>
                <div className="flex flex-row justify-between mt-[-40px] mb-[-20px]">
                  <Button
                    onClick={handleApply}
                    className="text-white bg-green-700 w-[100px] h-[40px]"
                  >
                    Apply
                  </Button>
                </div>
              </Paper>
            </div>
          )}
          {activeRole && step == 2 && <Application {...activeRole} />}
        </div>
      </div> */}
    </div>
  );
};

export default Listings;
