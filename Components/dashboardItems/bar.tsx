import React, { useState, useEffect } from 'react';
import { Paper } from "@mui/material";
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Props {
    value: number,
    name: string
}

export const Bar = ({value, name}: Props) => {
    // const [metric, setMetric] = useState<Metrics>();

    // const [height, setHeight] = useState<number>(170);
const points = ["10", "20", "30", "40", "50", "60", "70", "80"]

const renderPoints = (vals: string[]) => {
    return vals?.map((item: string, idx: number) => (
        <div key={idx}>
            {item}
        </div>
    ))
}
  return (
    <div>
        <div className='flex flex-row relative'>
        <div className='w-[120px] relative border-solid border-green-700 border-2 min-h-[400px] rounded-md'>
        <div style={{height: value}} className='bg-green-700 mb-[10px] w-[40px] absolute bottom-0 left-[38px] rounded-t-md'>

        </div>
        <div style={{height: value}} className='absolute bottom-0 mb-[15px] border-t-2 border-orange-400 w-[70px]'>
            <p className='mt-[-25px] ml-2'>
            {value}
            </p>
        </div>
    </div>
        </div>
    <p className='font-semibold'>{name}</p>
</div>
  )
}