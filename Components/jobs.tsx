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
  Button,
  Modal,
} from "@mui/material";
import { AddRole } from "./addRole";
import { Role } from "../types/roles";
import { Notifier } from "./notifier";
import { postAsync } from "../helpers/connection";

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
  const [searchVal, setSearchVal] = useState<string | null>(null);
  const [take, setTake] = useState<number>(10);
  const [job, setJob] = useState<{ [key: string]: string }>({
    name: "",
    code: "",
  });
  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });

  //* gets all job roles from e360
  const getJobs = (page?: number, take?: number) => {
    let body = {
      page: page,
      take: take,
    };
    postAsync(process.env.NEXT_PUBLIC_GET_ALL_JOB_ROLES as string, body)
      .then((res) => {
        if (res.code == 200) {
          setJobs(res.data);
          setDataCount(res.count);
          setSearchVal(null)
        }
      });
  };

  const changeJobStatus = (code: string, status: string) => {
    let body = {
      code: code,
      item: status
    }
    // console.log(body)
    postAsync(process.env.NEXT_PUBLIC_CHANGE_STATUS as string, body)
    .then((res) => {
      // console.log(res)
      if(res.code == 200) {
        setStatus({
          open: true,
          topic: "Successful",
          content: `Successfully changed to ${status}`,
        });
        getActiveJobs()
      }
    })
    .catch((err: AxiosError) => {
      console.log(err.message);
      setStatus({
        open: true,
        topic: "Unsuccessful",
        content: err.message,
      });
    })
  }

  //* gets active jobs
  const getActiveJobs = () => {
    let body = {
      value: "",
      page: 0,
      filter: ""
    }
    postAsync(process.env.NEXT_PUBLIC_GET_JOB_ROLES as string, body)
      .then((res) => {
        // console.log(res)
        if (res.code == 200) {
          setActiveJobs(res.data);
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
        <TableCell>{getJob(job.code)?.status == 'active' ? 'active' : 'inactive'}</TableCell>
        <TableCell>
          <Button className={["active", "inactive"].includes(getJob(job.code)?.status) ? "bg-green-700 h-[30px] text-white capitalize" : "h-[30px] text-white"} disabled={getJob(job.code) == null ? true : false} onClick={() => getJob(job.code)?.status == "active" ? changeJobStatus(job.code, "inactive") : changeJobStatus(job.code, "active")}>
            {getJob(job.code)?.status == "active" ? <p>Deactivate</p> : getJob(job.code)?.status == "inactive" ? <p>Reactivate</p> : null }
          </Button>
          </TableCell>
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
    if (checkJob(code) == "False") {
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
      postAsync(process.env.NEXT_PUBLIC_SEARCH_JOB_ROLES as string, body)
        .then((res) => {
          if (res.length > 0) {
            setJobs(res);
          }
        });
    }
  };

    //* clears the notifier state and closes the notifier
    const clearStatus = () => {
      setStatus({ open: false });
    };

  //* determines if the job role sis active or inactive
  const checkJob = (code: string): string => {
    let result = activeJobs?.find((item: Role) => item.code == code);
    if (result != null) {
      return "True";
    } else {
      return "False";
    }
  };

  const getJob = (code: string): Role => {
    let result = activeJobs?.find((item: Role) => item.code == code);
    if(result != null) {
      return result
    } else {
      return null
    }
  }

  //* sets the take for pagination
  const handleTakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var takeVal = parseInt(e.target.value);
    setTake(takeVal);
    getJobs(page, takeVal);
  };

  const handleRefresh = () => {
    getActiveJobs()
    getJobs(0, take);
    setSearchVal("")
  }

  return (
    <div>
      <Modal
        className="flex justify-center"
        open={status?.open ? true : false}
        onClose={clearStatus}
      >
        <Notifier
          topic={status?.topic ?? ""}
          content={status?.content ?? ""}
          close={clearStatus}
        />
      </Modal>
      <Paper className=" md:h-[80vh] bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed">
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
                  <TableCell>Job created</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderJobs()}</TableBody>
              <TableFooter>
                <TableRow>
                <Button className="text-green-700" onClick={handleRefresh}>
            Show all
          </Button>
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
          <AddRole name={job?.name} code={job?.code} cancel={cancelView} refresh={handleRefresh} />
        </div>
      )}
    </div>
  );
};
