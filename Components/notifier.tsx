import React, { useState } from 'react'
import { Paper, Button } from "@mui/material"
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface NotifierProps {
    topic: string,
    content: string,
    close: () => void,
    other?: () => void,
    hasNext?: boolean
}

export const Notifier = ({topic, content, close, other, hasNext}: NotifierProps) => {
    const [open, setOpen] = useState<boolean>(true)
  return (
    <div>
        <Paper className="flex flex-col w-[300px] mt-[70px] justify-items-center md:h-[200px] bg-slate-100 overflow-y-scroll p-4 pb-0">
            <div className='flex flex-row gap-3'>
                {topic.toLowerCase() != "successful" ? <ReportProblemIcon className='text-green-700 w-[40px] h-[40px] mt-[-5px]' /> : <DoneAllIcon className='text-green-700 w-[40px] h-[40px] mt-[-5px]' />}
                <p className='capitalize text-xl font-semibold'>{topic}</p>
            </div>
            <div className='bg-white p-3 rounded-md mt-[20px] h-[70px] flex justify-center text-center'>
                {content}
            </div>
            <div className='flex m-[10px] justify-end gap-4'>
                <Button onClick={() => close()} className='bg-green-700 h-[30px] text-white capitalize'>
                    Close
                </Button>
                {other && hasNext && (
                    <Button onClick={() => other?.()} className='bg-green-700 h-[30px] text-white capitalize'>
                    Proceed
                </Button>
                )}
            </div>
        </Paper>
    </div>
  )
}