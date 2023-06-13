import React, { useState } from "react";
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
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import error from "next/error";

export const JobFilters = ({
  fields,
  change,
  searchVal,
  searchRole,
  checkFields,
  checkChange,
}: any) => {
  const filterFields = [
    {
      title: "Locations",
      field: (
        <Input
          value={fields.location}
          onChange={(e) => change(e, "location")}
          className="h-[50px] w-[100%] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
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
    {
      title: "Skill",
      field: (
        <Input
          value={fields.skill}
          onChange={(e) => change(e, "skill")}
          className="h-[50px] w-[100%] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
          placeholder="Communications, Teamwork, Leadership"
          disableUnderline
        />
      ),
    },
    {
      title: "Degree",
      field: (
        <FormControl
          className="mt-[-5px]"
          sx={{ m: 3 }}
          component="fieldset"
          variant="standard"
        >
          <FormGroup className="flex flex-row">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkFields?.bachelors}
                  onChange={(e) => checkChange(e, "bachelors")}
                  name="gilad"
                />
              }
              label="Bachelors"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkFields?.masters}
                  onChange={(e) => checkChange(e, "masters")}
                  name="jason"
                />
              }
              label="Masters"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkFields?.phd}
                  onChange={(e) => checkChange(e, "phd")}
                  name="antoine"
                />
              }
              label="Ph.D"
            />
          </FormGroup>
        </FormControl>
      ),
    },

    {
      title: "Job types",
      field: (
        <FormControl
          className="mt-[-5px]"
          sx={{ m: 3 }}
          component="fieldset"
          variant="standard"
        >
          <FormGroup className="flex flex-row">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkFields?.fullTime}
                  onChange={(e) => checkChange(e, "fullTime")}
                  name="gilad"
                />
              }
              label="Full time"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkFields?.partTime}
                  onChange={(e) => checkChange(e, "partTime")}
                  name="jason"
                />
              }
              label="Part time"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkFields?.internship}
                  onChange={(e) => checkChange(e, "internship")}
                  name="antoine"
                />
              }
              label="Internship"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkFields?.contract}
                  onChange={(e) => checkChange(e, "contract")}
                  name="antoine"
                />
              }
              label="Contract"
            />
          </FormGroup>
        </FormControl>
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
    <div>
      <div className="flex flex-col justify-center bg-white h-[80px] p-3">
        <Input
          placeholder="Search for a job role"
          className="h-[50px] w-[100%] bg-white border-green-700 border-solid border-2 rounded-md no-underline px-4 shadow-lg"
          value={searchVal}
          onChange={(e) => searchRole(e)}
          disableUnderline
        />
      </div>
      <div className="">{renderFields()}</div>
    </div>
  );
};
