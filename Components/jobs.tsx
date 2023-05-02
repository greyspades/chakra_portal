import React, { useState, useEffect} from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Paper, Table, TableContainer, TableRow, TableCell, TableFooter, TableHead, TableBody, TablePagination, Input } from "@mui/material";
import { AddRole } from './addRole';
import { Role } from '../types/roles';

interface Job {
    Code: string,
    Item: string,
    
}

export const Jobs = () => {
    const [jobs, setJobs] = useState<Job[]>();
    const [page, setPage] = useState<number>(0);
    const [dataCount, setDataCount] = useState<number>(0);
    const [viewing, setViewing] = useState<boolean>(false);
    const [activeJobs, setActiveJobs] = useState<Role[]>();
    const [searchVal, setSearchVal] = useState<string>();
    const [take, setTake] = useState<number>(10)
    const [job, setJob] = useState<{[key: string]: string}>({
        name: "",
        code: ""
    })

    const getJobs = (page?: number, take?: number) => {
        axios.get(`http://localhost:5048/roles/Role/jobs/${page}/${take}`)
        .then((res: AxiosResponse) => {
            if(res.data.code == 200) {
                setJobs(res.data.data)
                setDataCount(res.data.count)
            }
        })
    }

    const getActiveJobs = () => {
        axios.get("http://localhost:5048/roles/Role")
        .then((res: AxiosResponse) => {
            if(res.data.code == 200) {
                setActiveJobs(res.data.data)
            }
        })
        .catch((err: AxiosError) => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        getActiveJobs()
        getJobs(page, take);
    }, [])

    const renderJobs = () => {
        return jobs?.map((job: Job, idx: number) => (
            <TableRow
          key={idx}
          hover role="checkbox" tabIndex={-1}
          className = ""
          onClick={() => selectJob(job.Item, job.Code)}
          // className="bg-white w-[100%] h-[40px] mt-3 flex flex-row rounded-md p-2 justify-between justify-items-center"
        >
          <TableCell className = "">
            {job.Item}
          </TableCell>
          <TableCell className = "">
            {job.Code}
          </TableCell>
          <TableCell className = "">
            {checkJob(job.Code)}
          </TableCell>
        </TableRow>
        ))
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, value: number) => {
        setPage(value);
        getJobs(value, take)
        // getApplicants(value)
      }
    
      const selectJob = (name: string, code: string) => {
        if(checkJob(code) == "Not Active") {
          let body = {
            name: name,
            code: code
        }
        setJob(body);
        setViewing(true)
        }
      }

      const cancelView = () => {
        setViewing(false);
      }

      const handleSearch = (e: React.ChangeEvent) => {
        
      }

      const checkJob = (code: string): string => {
        let result = activeJobs?.find((item: Role) => item.code == code);
        if(result != null) {
            return "Active";
        }
        else {
            return "Not Active";
        }
      }

      const handleTakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var takeVal = parseInt(e.target.value)
        setTake(takeVal)
        getJobs(page, takeVal)
      }

  return (
    <div>
        <Paper className=" md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed">
            <div>
            <p className="text-2xl h-[40px] mb-2"> All Jobs</p>
            </div>
            <div className=''>
            <TableContainer className="overflow-y-auto md:h-[420px]">
              <Table stickyHeader className="">
              <TableHead sx={{ display: "table-header-group" }}>
            <TableRow>
            <TableCell>
              Job
            </TableCell>
            <TableCell>
              Code
            </TableCell>
            <TableCell>
              Status
            </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {renderJobs()}
              </TableBody>
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
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleTakeChange}
              // ActionsComponent={TablePaginationActions}
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
  )
}
