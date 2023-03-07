import React, { useState } from "react";
import { Button } from "@mui/material";
import { AdminOptions } from "../types/options";
import { Navbar } from "../Components/navbar";
import { AddRole } from "../Components/addRole";
import { EditRole } from "../Components/editRole";
import ContactsIcon from '@mui/icons-material/Contacts';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Applications } from "../Components/Applications";
import { Staged } from "../Components/staged";

const Admin = () => {

  const [currentIdx, setCurrentIdx] = useState<number>(0)

  const options: AdminOptions[] = [
    {
      name: "Add Role",
      index: 0,
      icon: <PostAddIcon />
    },
    {
      name: "Update Role",
      index: 1,
      icon: <DriveFileRenameOutlineIcon />
    },
    {
      name: "View Applications",
      index: 2,
      icon: <ContactsIcon />
    },
    {
      name: "Add Team Member",
      index: 4,
      icon: <PersonAddIcon />
    },
  ];

  const displayItem = () => {
    switch(currentIdx) {
      case 0 :
        return <AddRole />
      
      case 1 :
        return <EditRole />

      case 2 :
        return <Applications />

      default:
        return <div>

        </div>
    }
    
  }

  return (
    <div className="">
      <Navbar />
      <div className="grid md:grid-cols-6 md:mt-[60px] h-[100%] gap-8">
        <div className="grid md:col-span-1 bg-slate-100 h-[180%]">
        <div className="bg-slate-100 p-4 h-[100%] fixed">
          {options.map((options: AdminOptions, idx) => (
            <Button onClick={() => setCurrentIdx(options.index)} key={idx} className="flex text-sm flex-row justify-start justify-items-center hover:bg-green-200 h-[40px] w-[100%] bg-white mt-6 p-2 text-center">
              <div className="text-green-700">
                {options.icon}
              </div>
              <div className="text-black text-sm">
              {options.name}
              </div>
              </Button>
          ))}
        </div>
        </div>
        <div className="md:col-span-5 md:ml-6">
          {displayItem()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
