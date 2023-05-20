import React, { useState } from "react";
import { Button } from "@mui/material";
import { AdminOptions } from "../types/options";
import { Navbar } from "../Components/navbar";
import { AddRole } from "../Components/addRole";
import { EditRole } from "../Components/editRole";
import ContactsIcon from "@mui/icons-material/Contacts";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Applications } from "../Components/Applications";
import { Staged } from "../Components/staged";
import { ScheduleInterview } from "../Components/interviews/add";
import { Schedule } from "../Components/interviews/schedule";
import { Finalists } from "../Components/finalists";
import { Dashboard } from "../Components/dashboard";
import { Jobs } from "../Components/jobs";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import GroupsIcon from "@mui/icons-material/Groups";
import FlagIcon from "@mui/icons-material/Flag";

const Admin = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  //* admin tab names and icons
  const options: AdminOptions[] = [
    {
      name: "Dashboard",
      index: 0,
      icon: <AnalyticsIcon className={currentIdx == 0 ? "text-white" : ""} />,
    },
    {
      name: "Jobs",
      index: 1,
      icon: (
        <ChromeReaderModeIcon className={currentIdx == 1 ? "text-white" : ""} />
      ),
    },
    {
      name: "View Applications",
      index: 2,
      icon: <ContactsIcon className={currentIdx == 2 ? "text-white" : ""} />,
    },
    {
      name: "Interviews",
      index: 3,
      icon: <GroupsIcon className={currentIdx == 3 ? "text-white" : ""} />,
    },
    {
      name: "Finalists",
      index: 4,
      icon: <FlagIcon className={currentIdx == 4 ? "text-white" : ""} />,
    },
  ];

  //* displays the view based on the selected index
  const displayItem = () => {
    switch (currentIdx) {
      case 0:
        return <Dashboard />;

      case 1:
        return <Jobs />;

      case 2:
        return <Applications />;

      case 3:
        return <Schedule />;

      case 4:
        return <Finalists />;

      default:
        return <div></div>;
    }
  };

  return (
    <div className="">
      <Navbar />
      <div className="grid md:grid-cols-6 md:mt-[60px] h-[100%] gap-8 capitalize">
        <div className="grid md:col-span-1 bg-slate-100 h-[180%]">
          <div className="bg-slate-100 p-4 h-[100%] fixed">
            {options.map((options: AdminOptions, idx) => (
              <Button
                onClick={() => setCurrentIdx(options.index)}
                key={idx}
                className={
                  currentIdx != idx
                    ? "flex text-sm flex-row justify-start justify-items-center hover:bg-green-200 h-[40px] w-[100%] bg-white mt-6 p-2 text-center text-black gap-3"
                    : "flex text-sm flex-row justify-start justify-items-center hover:bg-green-200 h-[40px] w-[100%] bg-green-700 mt-6 p-2 text-center text-white gap-3"
                }
              >
                <div className="text-green-700">{options.icon}</div>
                <div className="text-sm capitalize">{options.name}</div>
              </Button>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 md:ml-6">{displayItem()}</div>
      </div>
    </div>
  );
};

export default Admin;
