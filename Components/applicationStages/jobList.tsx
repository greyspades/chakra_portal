import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Input,
  InputAdornment,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
  Divider,
  Button
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import error from "next/error";
import { Role } from "../../types/roles";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LinkIcon from '@mui/icons-material/Link';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import { setRole } from "../../store/slices/roleSlice";


interface JobListProps {
  roles: Role[];
  setRole: Dispatch<SetStateAction<Role[]>>
}


export const JobList = ({ roles, setRole }: JobListProps) => {
    
    //* parses and maps through the job descriptions
    const parseDesc = (desc: string) => {
        if(desc) {
            return JSON.parse(desc).map(
                (item: { [key: string]: string }, idx: number) => (
                  <div key={idx}>
                    <div  className="flex flex-row gap-4 mt-2">
                    <p>{item?.["RowNum~~Blnk"]}</p>
                    <p className="capitalize">
                      {item?.["Job responsibility~~Sentc"].toLowerCase()}
                    </p>
                  </div>
                  </div>
                )
              );
        } else {
            return ""
        }
      };

      const parseSkills = (skills: string) => {
        if(skills) {
          return JSON.parse(skills).map((item: string, idx: number) => (
            <div className="text-black border-2 border-green-700 border-solid rounded-lg px-2 py-1">
              {item}
            </div>
          ))
        }
      }
  
  const toggleExpansion = (index: number) => {
    let update = roles.map((item: Role, idx: number) => {
      if(index == idx) {
        item.expanded = !item.expanded
      }
      return item
    })
    setRole(update)
  }

  const renderRoles = () => {
    return roles.map((item: Role, idx: number) => (
      <div key={idx} className="mb-8">
        <Paper className="bg-white p-4 px-8">
            <div className="my-4">
                <p className="font-semibold text-[24px]">
                    {item.name}
                </p>
            </div>
            <div className="w-[100%] justify-between flex flex-row">
              <div className="w-[30%] flex flex-row gap-8">
              <div className="flex flex-row">
                        <LocationCityIcon className="text-green-700" />
                        {item?.location ?? "Lapo"}
                    </div>
                    <div className="flex flex-row">
                        <LocationOnIcon className="text-green-700" />
                        {item?.location ?? "maryland bus stop"}
                    </div>
              </div>
                <div className="flex flex-row gap-8">
                  <div className="flex flex-row justify-items-center">
                      <p>Share</p>
                      <LinkIcon className="text-green-700" />
                  </div>
                  <div className="flex flex-row">
                      <p>Save</p>
                      <TurnedInNotIcon className="text-green-700" />
                  </div>
                </div>
            </div>
            <Divider variant="middle" className="mx-0 my-4" />
            <div>
                <p className="font-semibold text-[20px]">
                    Job description:
                </p>
            </div>
              <div className={!item.expanded ? "h-[70px] overflow-hidden" : ""}>
            <div >
                {parseDesc(item.description as string)}
            </div>
            <div>
                <p className="font-semibold text-[20px]">
                    Required Skills:
                </p>
            </div>
            <div className="flex flex-row gap-4 mt-2">
                {parseSkills(item.skills as string)}
            </div>
              </div>
            <div className="flex justify-center">
              <Button onClick={() => toggleExpansion(idx)} className="text-green-700">
                {item.expanded ? <p>Show less</p> : <p>Show more</p>}
              </Button>
            </div>
        </Paper>
      </div>
    ));
  };

  return <div className="w-[71%] pr-4">{renderRoles()}</div>;
};
