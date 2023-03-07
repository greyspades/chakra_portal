import React, { useEffect, useContext } from 'react'
import { useSelector } from 'react-redux';
import { getCandidate } from "../store/slices/candidateSlice";
import { getRole } from '../store/slices/roleSlice';
import { Role } from '../types/roles';
import { Candidate } from '../types/candidate';
import { Navbar } from '../Components/navbar';
import { Button } from '@mui/material';
import { MainContext } from '../context';
import { Paper } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';


const Confirmation = () => {

    const { candidate, setCandidate, role, setRole } = useContext(MainContext) as any
// const role = useSelector(getRole)
// const candidate = useSelector(getCandidate)

useEffect(() => {
console.log(candidate)
}, [])

    return (
        <div className='grid w-[100%]'>
            <Navbar />
            <div className='grid justify-center md:mt-[150px] md:w-[100%]'>
                <Paper className='grid justify-center md:h-[300px] md:w-[400px] bg-slate-100 p-4'>
                    <div className='h-[100px] w-[200px] grid justify-items-center'>
                    <h3 className='text-2xl font-semibold'>
                            Success
                        </h3>
                        <VerifiedIcon className='w-[60px] h-[60px] text-green-700' />
                    </div>

                    <p className='bg-red-400 text-center grid w-[300px]'>
                        Congratulations {candidate.firstName}, you have successfully applied for the role of {role.name}
                    </p>
                </Paper>
            </div>
        </div>
    )
}

export default Confirmation