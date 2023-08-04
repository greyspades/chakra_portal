import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/navbar'
import { Paper, CircularProgress } from '@mui/material'
import VerifiedIcon from "@mui/icons-material/Verified";
import { useRouter } from 'next/router';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Footer from '../components/footer';


const EmailConfirmation = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(false);

    useEffect(() => {
        const { email } = router.query
        if(email && router.isReady) {
            setLoading(true);
            let body = {
                email
            }
            axios.post(process.env.NEXT_PUBLIC_VALIDATE_EMAIL as string, body)
            .then((res: AxiosResponse) => {
                if(res.data.code == 200) {
                    setLoading(false);
                    setVerified(true);
                } else {
                    setLoading(false)
                }
            }).catch((err: AxiosError) => {
                console.log(err.message)
                setLoading(false);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady])

  return (
    <div>
        <Navbar />
        <div className='flex justify-center mt-[100px]'>
            {verified && (
                <Paper className="flex flex-col w-[50%] justify-items-center md:h-[85%] bg-slate-100 overflow-y-scroll p-4 py-10">
                <div>
                    <div className='flex justify-center'>
                    <VerifiedIcon className="text-green-700 w-[80px] h-[80px]" />
                    </div>
                    <p className='text-center'>
                        Congratulations your email has been verified successfully
                    </p>
                </div>
            </Paper>
            )
            }
            {loading && (
                <CircularProgress thickness={7} className="text-green-700" />
            )}
        </div>
        <div className='mt-[200px]'>
        <Footer />
      </div>
    </div>
  )
}
export default EmailConfirmation