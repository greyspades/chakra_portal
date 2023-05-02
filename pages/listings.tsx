import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { Formik } from "formik";
import {
  Button,
  Paper,
  Input,
  Divider,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Modal,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
// import { GetStaticProps } from 'next';
import { Search } from "../Components/search";
import { Role } from "../types/roles";
import LensIcon from "@mui/icons-material/Lens";
import { Application } from "../Components/application";
import { Signup } from "../Components/applicationStages/signup";
import { Navbar } from "../Components/navbar";
import { MainContext } from "../context";
import { Notifier } from "../Components/notifier";

const Listings = ({ data }: any) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [activeRole, setActiveRole] = useState<Role>();
  const [step, setStep] = useState<number>(1);
  const [unit, setUnit] = useState<string | null>();
  const [applying, setApplying] = useState<{[key: string]: any}>({});
  const [nav, setNav] = useState<string>("")
  const [status, setStatus] = useState<{[key: string]: any}>({
    open: false
  })

  const { loggedIn, setLoggedIn } = useContext(MainContext) as any


  const getAllRoles = () => {
    Axios.get("http://localhost:5048/roles/Role").then((res) => {
      setRoles(res.data.data);
      setActiveRole(res.data.data[0]);
      // console.log(res.data.data)
    });
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  useEffect(() => {
    if (unit) {
      Axios.get(`http://localhost:5048/roles/Role/byUnit/${unit}`).then(
        (res) => {
          setRoles(res.data);
          console.log(res.data);
          // setActiveRole(res.data.data[0])
        }
      );
    }
  }, [unit]);

  const searchRole = (e: any) => {
    setSearchVal(e.target.value);
  };

  const handleUnitChange = (event: SelectChangeEvent) => {
    if (event.target.value == "All") {
      setUnit(null);
      getAllRoles();
    } else {
      setUnit(event.target.value as string);
    }
  };

  const units: string[] = [
    "Finance",
    "Networking",
    "Audit",
    "Legal",
    "Maintainance",
    "It",
    "All",
  ];

  const handleRoleSelect = (role: Role) => {
    setActiveRole(role);
    setStep(1);
  };

  const handleGoBack = () => {
    setStep(0);
  };

  const handleApply = () => {
    var user = sessionStorage.getItem("cred")
    if(user) {
      setStep(2)
    }
    else {
      setApplying({
        value: true,
        source: "main"
      })
    }
  }

  const login = () => {
    var user = sessionStorage.getItem("cred")
    if(!user) {
      setApplying({
        value: true,
        source: "nav"
      })
    }
  }

  const logout = () => {
    sessionStorage.clear()
    setLoggedIn(false)
    setStep(1)
    clearStatus()
    // setStatus({
    //   open: true,
    //   topic: "Successful",
    //   content: "Logged Out Successfully"
    // })
  }
  
  const showLogout = () => {
    setStatus({
      open: true,
      topic: "Confirmation",
      content: "Are you sure you want to sign out",
      hasNext: true
    })
  }

  const handleNav = (item: string) => {
    setNav(item)
    setApplying({value: true})
  }

  const clearStatus = () => setStatus({open: false})

  return (
    <div>
      <Modal className="flex justify-center" open={status?.open ? true : false} onClose={clearStatus}>
        <Notifier hasNext={status.hasNext} topic={status?.topic ?? ""} content={status?.content ?? ""} close={clearStatus} />
      </Modal>
      
      <Modal onClose={() => setApplying({value: false})} open={applying.value} className="flex justify-center">
          <Signup login={true} exit={() => setApplying({value: false})} next={() => applying.source != "main" ? setStep(1) : setStep(2)} nextPage={nav == "status" ? "applicant" : ""} />
      </Modal>
      <Navbar handleNav={handleNav} next={() => setStep(1)} />
      <div className="md:w-[65%] mt-[80px] grid grid-cols-3 gap-8 fixed capitalize">
      <div className="">
        <div className="flex flex-col justify-center bg-green-700 h-[120px] p-3">
          <Input
            placeholder="Search for a job role"
            className="md:w-[100%] h-[40px] bg-slate-100 rounded-md p-2 md:mt-[10px]"
            value={searchVal}
            onChange={(e) => searchRole(e)}
          />
        </div>
        <ul className="static bg-slate-100 overflow-auto h-[420px] pb-4">
          {roles
            .filter((item: Role) =>
              item.name.toLowerCase().includes(searchVal.toLowerCase())
            )
            .map((role: Role, index) => (
              <li key={index} className="flex justify-center">
                <button onClick={() => handleRoleSelect(role)} className="mt-2">
                  <Paper className={activeRole != role ? "p-2 w-[200px]" : "p-2 w-[200px] bg-green-700 text-white"}>{role.name}</Paper>
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="grid col-span-2 md:w-[170%]">
        {activeRole && step == 1 && (
          <div>
            {/* <p className="text-2xl font-semibold ml-4 mt-[-15px]">
          Job Details
        </p> */}
            <Paper className=" md:h-[500px] bg-slate-100 grid p-6 align-middle pb-0">
            <p className="text-3xl font-semibold flex flex-row w-[100%]">
              {activeRole.name}
              <LensIcon
                className="mt-[13px] ml-2"
                style={{ color: "green", width: 15, height: 15 }}
              />
            </p>
            <div className="w-[100%] h-[250px] bg-white leading-relaxed overflow-y-scroll rounded-md p-4">
              {activeRole.description}
            </div>
            <Divider
              variant="fullWidth"
              className="bg-green-700 h-[2px]"
            />

            <div className="flex flex-row md:gap-10 mt-[-40px]">
              <span className="flex gap-2 items-center h-[60px] content-center text-[18px]">
                <p className="flex w-auto">Unit:</p>
                <p className="text-green-700 justify-start font-semibold">
                  {activeRole.unit}
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
    </div>
    </div>
  );
};

// export async function getStaticProps(context: any) {

//     const res = await fetch("http://localhost:5048/roles/Role")

//     const data = await res.json()

//     console.log(data)
//     console.log('we don reach o')

//     return {
//         props: {
//             data
//         }
//     }
// }

export default Listings;
