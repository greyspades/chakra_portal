import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableFooter,
  TableHead,
  TableBody,
  TablePagination,
  Input,
} from "@mui/material";
import { AddRole } from "./addRole";
import { Role } from "../types/roles";

interface Job {
  code: string;
  item: string;
}

export const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>();
  const [page, setPage] = useState<number>(0);
  const [dataCount, setDataCount] = useState<number>(0);
  const [viewing, setViewing] = useState<boolean>(false);
  const [activeJobs, setActiveJobs] = useState<Role[]>();
  const [searchVal, setSearchVal] = useState<string>();
  const [take, setTake] = useState<number>(10);
  const [job, setJob] = useState<{ [key: string]: string }>({
    name: "",
    code: "",
  });

  //* gets all job roles from e360
  const getJobs = (page?: number, take?: number) => {
    let body = {
      page: page,
      take: take,
    };
    axios
      .post(process.env.NEXT_PUBLIC_GET_ALL_JOB_ROLES as string, body)
      .then((res: AxiosResponse) => {
        if (res.data.code == 200) {
          setJobs(res.data.data);
          setDataCount(res.data.count);
        }
      });
  };

  //* gets active jobs
  const getActiveJobs = () => {
    axios
      .get(process.env.NEXT_PUBLIC_GET_JOB_ROLES as string)
      .then((res: AxiosResponse) => {
        if (res.data.code == 200) {
          setActiveJobs(res.data.data);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getActiveJobs();
    getJobs(page, take);
  }, []);

  //* renders all job roles
  const renderJobs = () => {
    return jobs?.map((job: Job, idx: number) => (
      <TableRow
        key={idx}
        hover
        role="checkbox"
        tabIndex={-1}
        className=""
        onClick={() => selectJob(job.item, job.code)}
      >
        <TableCell className="">{job.item}</TableCell>
        <TableCell className="">{job.code}</TableCell>
        <TableCell className="">{checkJob(job.code)}</TableCell>
      </TableRow>
    ));
  };

  //* moves to the next page
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    value: number
  ) => {
    setPage(value);
    getJobs(value, take);
  };

  //* selects a job
  const selectJob = (name: string, code: string) => {
    if (checkJob(code) == "Not Active") {
      let body = {
        name: name,
        code: code,
      };
      setJob(body);
      setViewing(true);
    }
  };

  //* cancels the personal info view
  const cancelView = () => {
    setViewing(false);
  };

  //* searches for a job role
  const handleSearch = (e: any) => {
    if (e.target.value) {
      let body = {
        value: e.target.value,
      };
      axios
        .post(process.env.NEXT_PUBLIC_SEARCH_JOB_ROLES as string, body)
        .then((res: AxiosResponse) => {
          if (res.data.length > 0) {
            setJobs(res.data);
          }
        });
    }
  };

  //* determines if the job role sis active or inactive
  const checkJob = (code: string): string => {
    let result = activeJobs?.find((item: Role) => item.code == code);
    if (result != null) {
      return "Active";
    } else {
      return "Not Active";
    }
  };

  //* sets the take for pagination
  const handleTakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var takeVal = parseInt(e.target.value);
    setTake(takeVal);
    getJobs(page, takeVal);
  };

  return (
    <div>
      <Paper className=" md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed">
        <div className="flex flex-row justify-between">
          <p className="text-2xl h-[40px] mb-2"> All Jobs</p>
          <Input
            value={searchVal}
            onChange={handleSearch}
            placeholder="Search Job Roles"
            className="bg-white w-[200px] h-[40px] p-1 m-2"
          />
        </div>
        <div className="">
          <TableContainer className="overflow-y-auto md:h-[420px]">
            <Table stickyHeader className="">
              <TableHead sx={{ display: "table-header-group" }}>
                <TableRow>
                  <TableCell>Job</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderJobs()}</TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={dataCount}
                    rowsPerPage={take}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleTakeChange}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      </Paper>
      {viewing && (
        <div>
          <AddRole name={job?.name} code={job?.code} cancel={cancelView} />
        </div>
      )}
    </div>
  );
};
