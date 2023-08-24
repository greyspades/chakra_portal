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
  Button,
  IconButton,
} from "@mui/material";
import { ExpandMore, FirstPage } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import error from "next/error";
import { Role } from "../../types/roles";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LinkIcon from "@mui/icons-material/Link";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { setRole } from "../../store/slices/roleSlice";
import BadgeIcon from "@mui/icons-material/Badge";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface JobListProps {
  roles: Role[];
  setRole: Dispatch<SetStateAction<Role[]>>;
  apply: (role: Role) => void;
  getRoles: (page: number, filter?: string, filterType?: string) => void;
  currentStep: number;
  refresh: () => void;
  count: number;
}

export const JobList = ({
  roles,
  setRole,
  apply,
  getRoles,
  currentStep,
  refresh,
  count,
}: JobListProps) => {
  const [page, setPage] = useState<number>(0);

  const nextPage = () => {
    if (roles.length > 0) {
      setPage((page) => page + 1);
      getRoles(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage((page) => page - 1);
      getRoles(page - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToLast = () => {
    let lastPage = parseInt((count / 10).toString(), 10) - 1;
    console.log(lastPage);
    setPage(lastPage);
    getRoles(1);
    window.scrollTo(0, 0);
  };

  const goToFirst = () => {
    setPage(0);
    getRoles(0);
    window.scrollTo(0, 0);
  };

  //* parses and maps through the job descriptions
  const parseDesc = (desc: string) => {
    if (desc) {
      return JSON.parse(desc).map(
        (item: { [key: string]: string }, idx: number) => (
          <div key={idx}>
            <div className="flex flex-row gap-4 mt-2">
              <p>{item?.["RowNum~~Blnk"]}</p>
              <p className="capitalize">
                {item?.["Job responsibility~~Sentc"]?.toLowerCase()}
              </p>
            </div>
          </div>
        )
      );
    } else {
      return "";
    }
  };

  const parseSkills = (skills: string) => {
    if (skills) {
      return JSON.parse(skills).map((item: string, idx: number) => (
        <div
          key={idx}
          className="text-black border-2 border-green-700 border-solid rounded-lg px-2 py-1"
        >
          {item}
        </div>
      ));
    }
  };

  const toggleExpansion = (index: number) => {
    let update = roles.map((item: Role, idx: number) => {
      if (index == idx) {
        item.expanded = !item.expanded;
      }
      return item;
    });
    setRole(update);
  };

  const renderRoles = () => {
    return roles?.map((item: Role, idx: number) => {
      // if(item.status == "active") {
      return (
        <div key={idx} className="mb-8">
          <Paper
            className={
              currentStep == 1
                ? "bg-white p-2 md:px-8 px-2"
                : "bg-white p-2 md:px-4 px-2"
            }
          >
            <div className="">
              <div className="my-2 md:px-0 px-2">
                <p className="font-semibold md:text-[24px] text-[20px]">
                  {item?.name}
                </p>
              </div>
              <div className="w-[100%] justify-between flex flex-row md:px-0 px-2">
                <div
                  className={
                    currentStep == 1
                      ? "md:w-[50%] w-[100%] flex flex-row gap-8"
                      : "w-[150%] flex flex-row gap-2"
                  }
                >
                  {/* <div className="flex flex-row place-items-center">
                        <LocationCityIcon className="text-green-700 w-[17px] h-[17px]" />
                        {item?.location ?? "Lapo"}
                    </div> */}
                  <div className="flex flex-row place-items-center">
                    <LocationOnIcon className="text-green-700 w-[17px] h-[17px]" />
                    {item?.location ?? "maryland bus stop"}
                  </div>
                  <div className="flex flex-row place-items-center">
                    <BadgeIcon className="text-green-700 w-[17px] h-[17px]" />
                    {item?.jobtype ?? "Full time"}
                  </div>
                </div>
                {/* <div className="flex flex-row gap-8">
                  <div className="flex flex-row justify-items-center">
                      <p>Share</p>
                      <LinkIcon className="text-green-700" />
                  </div>
                  <div className="flex flex-row">
                      <p>Save</p>
                      <TurnedInNotIcon className="text-green-700" />
                  </div>
                </div> */}
              </div>
            </div>
            <Divider variant="middle" className="mx-0 my-4" />
            <div className="mx-2">
              <div>
                <p className="font-semibold text-[20px]">Job description:</p>
              </div>

              <div className={!item.expanded ? "h-[10px] overflow-hidden" : ""}>
                <div>{parseDesc(item.description as string)}</div>
                <div className="mt-4">
                  <p className="font-semibold text-[20px]">Required Skills:</p>
                </div>
                <div className="flex flex-row gap-4 mt-2 flex-wrap">
                  {parseSkills(item.skills as string)}
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-[20px]">Qualifications:</p>
                </div>
                <div className="flex flex-row gap-4 mt-2">
                  {item?.qualification}
                </div>
                <div className="flex justify-center mt-6">
                  <Button
                    className="bg-green-700 h-[40px] md:w-[30%] w-[90%] capitalize text-white"
                    onClick={() => apply(item)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                onClick={() => toggleExpansion(idx)}
                className="text-green-700"
              >
                {item.expanded ? <p>Show less</p> : <p>Show more</p>}
              </Button>
            </div>
          </Paper>
        </div>
      );
      // }
    });
  };

  return (
    <div className="text-[14px] md:text-[16px]">
      <div className="">{renderRoles()}</div>
      <div className="flex justify-center bg-white h-[60px] rounded-md flex-row">
        <div
          className={
            currentStep == 1
              ? "flex flex-row md:w-[50%] w-[80%] justify-between place-items-center"
              : "flex flex-row w-[100%] justify-between place-items-center"
          }
        >
          <div className="flex flex-row justify-center place-items-center gap-4">
            {/* <IconButton onClick={goToFirst} className="rounded-full shadow-md">
          <KeyboardDoubleArrowLeftIcon className="text-green-700 w-[30px] h-[30px]" />
        </IconButton> */}
            <IconButton className="rounded-full shadow-md" onClick={prevPage}>
              <KeyboardArrowLeftIcon className="text-green-700 w-[30px] h-[30px]" />
            </IconButton>
            {/* <p>prev Page</p> */}
          </div>
          <div className="flex flex-row place-items-center gap-4">
            <p className="semibold">Page</p>
            <p className="text-[18px] text-green-700 font-semibold">
              {page + 1}
            </p>
          </div>
          <div className="flex flex-row justify-center place-items-center gap-4">
            {/* <p>next Page</p> */}
            <IconButton className="rounded-full shadow-md" onClick={nextPage}>
              <KeyboardArrowRightIcon className="text-green-700 w-[30px] h-[30px]" />
            </IconButton>
            {/* <IconButton onClick={goToLast} className="rounded-full shadow-md">
          <KeyboardDoubleArrowRightIcon className="text-green-700 w-[30px] h-[30px]" />
        </IconButton> */}
          </div>
        </div>
        <div className="flex place-items-center">
          <IconButton
            className="ml-[30px] rounded-full shadow-md"
            onClick={refresh}
          >
            <RefreshIcon className="text-green-700" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
