import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Formik } from "formik";
import { Button, Paper, Input, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
// import { GetStaticProps } from 'next';
import { Search } from "../Components/search";
import { Role } from "../types/roles";
import LensIcon from '@mui/icons-material/Lens';
import { Application } from "../Components/application";

const Listings = ({ data }: any) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [activeRole, setActiveRole] = useState<Role>();
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    Axios.get("http://localhost:5048/roles/Role").then((res) => {
      setRoles(res.data.data);
      setActiveRole(res.data.data[0])
      // console.log(res.data.data)
    });
  }, []);

  const searchRole = (e: any) => {
    setSearchVal(e.target.value);
  };

  return (
    <div className="md:w-[65%] mt-[80px] grid grid-cols-3 gap-8 fixed">
      <div className="grid-rows-2">
        <div className="grid justify-center bg-green-700 h-[60px]">
          <Input
            placeholder="Search for a role"
            className="md:w-[120%] h-[40px] bg-slate-100 rounded-md md:ml-[-19px] p-2 md:mt-[10px]"
            value={searchVal}
            onChange={(e) => searchRole(e)}
          />
        </div>
        <ul className="static bg-slate-100 overflow-auto h-[600px]">
          {roles
            .filter((item: Role) =>
              item.name.toLowerCase().includes(searchVal.toLowerCase())
            )
            .map((role: Role, index) => (
              <li key={index} className="flex justify-center">
                <button onClick={() => setActiveRole(role)} className="mt-2">
                  <Paper className="p-2 w-[200px]">{role.name}</Paper>
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="grid col-span-2 md:w-[170%]">
        {(activeRole && step == 1) && (
          <Paper className=" md:h-[500px] bg-slate-100 grid p-6 align-middle pb-0">
          <p className="text-3xl font-semibold flex flex-row w-[100%]">
              {activeRole.name}
              <LensIcon className="mt-[13px] ml-2" style={{color: "green", width: 15, height: 15}} />
          </p>
          <div className="grid w-[100%] bg-white h-[130%] row-span-3 rounded-md p-4 leading-3">
            {activeRole.description}
          </div>
          <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-[80px]" />

          <div className="flex flex-row md:gap-10 h-[80px] mt-[-40px]">
            <span className="flex gap-2 items-center h-[60px] content-center text-[18px]">
              <p className="flex w-auto">
                Unit:
              </p>
              <p className="text-green-700 justify-start font-semibold">
              {activeRole.unit}
              </p>
            </span>

            <span className="flex gap-2 items-center h-[60px] content-center text-[18px] ">
              <p className="flex w-auto">
              Required Experience:
              </p>
              <p className="flex text-green-700 justify-start font-semibold">
              {activeRole.experience} years
              </p>
            </span>

            <span className="flex gap-2 items-center h-[60px] content-center text-[18px] ">
              <p className="flex w-auto">
              Application Deadline:
              </p>
              <p className="flex text-green-700 justify-start font-semibold">
              {activeRole.deadline.toString().split('T')[0]}
              </p>
            </span>
          </div>
          <div className="flex flex-row justify-between mt-[-40px] mb-[-20px]">
          <span className="flex gap-2 items-center text-[24px] mt-[-70px]">
              <p className="flex w-auto">
              Average Pay:
              </p>
              <p className="flex text-green-700 font-semibold">
              N{activeRole.salary}K
              </p>
            </span>
            <Button onClick={() => setStep(2)} className="text-white bg-green-700 w-[100px] h-[40px]">
              Apply
            </Button>
          </div>
        </Paper>
        )}
        {(activeRole && step == 2) && (
          <Application {...activeRole} />
        )}
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
