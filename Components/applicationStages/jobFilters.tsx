import React, { useEffect, useState } from "react";
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
  Select,
  MenuItem,
  IconButton,
  Button
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import error from "next/error";
import { Close } from "@mui/icons-material";

interface JobFilterProps {
  change: (e: any, f: string) => void,
  searchVal: string,
  searchRole: (e: any) => void,
  checkFields: {[key: string]: any},
  jobTypeChange: (e: any) => void,
  fields: {[key: string]: any},
  jobType: string,
  eduType: string,
  eduTypeChange: (e: any) => void,
  mobile: boolean,
  hideFilter:() => void
}

export const JobFilters = ({
  fields,
  change,
  searchVal,
  searchRole,
  checkFields,
  jobTypeChange,
  jobType,
  eduType,
  eduTypeChange,
  mobile,
  hideFilter
}: JobFilterProps) => {

  const jobTypes = [
    "Full time",
    "Part time",
    "Contract",
    "Internship"
  ]

  useEffect(() => console.log(mobile), [])

  const degrees = ["BSC", "MSC", "MBA", "PHD", "HND", "OND", "Other"];

  const filterFields = [
    {
      title: "Locations",
      field: (
        <Input
          value={fields.location}
          onChange={(e) => change(e, "location")}
          className="h-[50px] w-[100%] bg-gray-200 border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
          disableUnderline
          placeholder="Lagos, Benin, Abuja"
          startAdornment={
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          }
        />
      ),
    },
    // {
    //   title: "Skill",
    //   field: (
    //     <Input
    //       value={fields.skill}
    //       onChange={(e) => change(e, "skill")}
    //       className="h-[50px] w-[100%] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
    //       placeholder="Communications, Teamwork, Leadership"
    //       disableUnderline
    //     />
    //   ),
    // },
    {
      title: "Degree",
      field: (
        <Select
          value={eduType}
          onChange={eduTypeChange}
          className="h-[50px] w-[100%] bg-gray-200 border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
          >{degrees.map((item: string, idx: number) => (
            <MenuItem key={idx} value={item}>
              {item}
            </MenuItem>
          ))}</Select>
      ),
    },
    {
      title: "Job types",
      field: (
        <Select
          value={jobType}
          onChange={jobTypeChange}
          className="h-[50px] w-[100%] bg-gray-200 border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
          >{jobTypes.map((item: string, idx: number) => (
            <MenuItem key={idx} value={item}>
              {item}
            </MenuItem>
          ))}</Select>
      ),
    },
  ];

  const renderFields = () => {
    return filterFields.map((item: { [key: string]: any }, idx: number) => (
      <Accordion className="" key={idx}>
        <AccordionSummary
          className="h-[70px]"
          expandIcon={<ExpandMore />}
        >
          <Typography className="font-semibold text-[16px]">
            {item.title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>{item.field}</div>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <div className="h-auto">
      <div className="flex flex-col md:flex-row md:justify-center justify-between bg-white p-3">
        <Input
          placeholder="Search for a job role"
          className="h-[50px] w-[100%] bg-gray-100 border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
          value={searchVal}
          onChange={(e) => searchRole(e)}
          disableUnderline
        />
        {mobile &&(
          <div className="flex justify-end">
            <Button className="" onClick={hideFilter}>
              {/* <Close className="text-green-700" /> */}
              <p className="text-green-700 text-[12px]">Hide filters</p>
            </Button>
          </div>
        )}
      </div>
      <div className="overflow-y-scroll">{renderFields()}</div>
    </div>
  );
};
