import React, { useState, useEffect } from 'react';
import { Paper } from "@mui/material";
import axios, { AxiosError, AxiosResponse } from 'axios';
import { getContent, postAsync } from '../helpers/connection';

interface Metrics {
    applications: number,
    finalists: number,
    jobRoles: number,
    hired: number
}

export const Dashboard = () => {
    const [metrics, setMetrics] = useState<Metrics>();

    const [height, setHeight] = useState<number>(170);

    const [dummy, setDummy] = useState<{[key: string]: string}[]>([{}])

    useEffect(() => {
      // let update = [ ...dummy,]
      let update = dummy.map((item: {[key: string]: string}, idx: number) => {
        // let updatedObj = { ...item, item["fwff"]}
        return item;
      })
      setDummy(update)
    },[])

    useEffect(() => {
        getContent("getMetrics")
        .then((res) => {
            setMetrics(res.data);
        })
        .catch((err: AxiosError) => {
            console.log(err.message)
        })
    }, [])
  return (
    <div className=''>
      <Paper className=" md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed">
        <div className='flex flex-row justify-between'>
        <div className='w-[200px] grid grid-rows-2 justify-center py-6 relative border-solid border-green-700 border-2 min-h-[200px] rounded-md'>
        <div className='grid justify-center'>
        <p className='text-[50px] font-semibold text-green-700'>
          {metrics?.jobRoles}
        </p>
        </div>
        <div className='mt-[30px]'>
          <p className='font-semibold'>
            Active Jobs
          </p>
        </div>
        </div>

        <div className='w-[200px] grid grid-rows-2 justify-center py-6 relative border-solid border-green-700 border-2 min-h-[200px] rounded-md'>
        <div className='grid justify-center'>
        <p className='text-[50px] font-semibold text-green-700'>
          {metrics?.applications}
        </p>
        </div>
        <div className='mt-[30px]'>
          <p className='font-semibold'>
            Applications
          </p>
        </div>
        </div>

        <div className='w-[200px] grid grid-rows-2 justify-center py-6 relative border-solid border-green-700 border-2 min-h-[200px] rounded-md'>
        <div className='grid justify-center'>
        <p className='text-[50px] font-semibold text-green-700'>
          {metrics?.finalists}
        </p>
        </div>
        <div className='mt-[30px]'>
          <p className='font-semibold'>
            Finalists
          </p>
        </div>
        </div>

        <div className='w-[200px] grid grid-rows-2 justify-center py-6 relative border-solid border-green-700 border-2 min-h-[200px] rounded-md'>
        <div className='grid justify-center'>
        <p className='text-[50px] font-semibold text-green-700'>
          {metrics?.hired}
        </p>
        </div>
        <div className='mt-[30px]'>
          <p className='font-semibold'>
            Hired
          </p>
        </div>
        </div>
        </div>
      </Paper>
    </div>
  )
}