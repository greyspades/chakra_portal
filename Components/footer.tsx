import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Divider, IconButton } from '@mui/material'
import React from 'react'
import { PlayArrow } from '@mui/icons-material'
import AppleIcon from '@mui/icons-material/Apple';
import { LinkedIn } from '@mui/icons-material';
import { Facebook } from '@mui/icons-material';
import { Instagram } from '@mui/icons-material';
import { Twitter } from '@mui/icons-material';
import { YouTube } from '@mui/icons-material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const Footer = () => {
    
  return (
    <div className='md:p-[70px] p-10 text-[13px] text-slate-500 font-semibold bg-gray-300 pb-4'>
        <div className='flex justify-between flex-wrap md:gap-0 gap-4'>
            <div className='flex flex-col gap-2'>
                <p className='text-black text-[16px] font-bold mb-2'>About LAPO</p>
                <a href='https://www.lapo-nigeria.org/about-us'>About Us</a>
                <a href='https://www.lapo-nigeria.org/about/our-impact'>Our Impact</a>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-black text-[16px] font-bold mb-2'>Digital Services</p>
                <a href='https://play.google.com/store/apps/details?id=com.ofss.lapobank'>Mobile Banking</a>
                <a href='https://sme.lapo-nigeria.org'>SME Online</a>
                <a href='https://ps.lapo-nigeria.org'>Public sector Online</a>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-black text-[16px] font-bold mb-2'>Products</p>
                <a href='https://www.lapo-nigeria.org/loans/regular'>Regular Loan</a>
                <a href='https://www.lapo-nigeria.org/loans/sme'>SME Loan</a>
                <a href='https://www.lapo-nigeria.org/loans/education'>Educational Loan</a>
                <a href=' https://www.lapo-nigeria.org/loans/agric'>Agricultural Loan</a>
                <a href='https://www.lapo-nigeria.org/loans/education'>Regular Savings</a>
                <a href='https://www.lapo-nigeria.org/savings/my-pikin'>My Pikin Savings</a>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-black text-[16px] font-bold mb-2'>Quick Links</p>
                <a href='https://www.lapo-nigeria.org/customer-services'>Customer Service</a>
                <a href=' https://www.lapo-nigeria.org/Whistleblow'>Whistleblow Policy</a>
                <a href=' https://www.lapo-nigeria.org/lapo-privacy-policy'>Privacy Policy</a>
                <a href='https://www.lapo-nigeria.org/bvn-consent-terms'>BVN Consent Term</a>
                <a href='https://www.lapo-nigeria.org/lapo-logo'>LAPO Logo</a>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-black text-[16px] font-bold mb-2'>Connect</p>
                <div className='flex gap-4'>
                    <Button className='bg-black rounded-md flex flex-row justify-between w-[120px] h-[45px]'>
                    <AppleIcon className='h-[30px] w-[30px] text-white' />
                    <p className='text-white text-[10px] capitalize'>Download on Appstore</p>
                    </Button>

                    <Button className='bg-black rounded-md flex flex-row justify-between w-[120px] h-[45px]'>
                    <PlayArrow className='h-[30px] w-[30px] text-white' />
                    <p className='text-white text-[10px] capitalize'>Get it on Google Play</p>
                    </Button>
                </div>
                <div className='flex gap-2 mt-4'>
                    <div className='w-[45px] h-[45px] rounded-[25px] bg-white flex justify-center place-items-center'>
                        <Facebook className='text-slate-500' />
                    </div>
                    <div className='w-[45px] h-[45px] rounded-[25px] bg-white flex justify-center place-items-center'>
                        <Instagram className='text-slate-500' />
                    </div>
                    <div className='w-[45px] h-[45px] rounded-[25px] bg-white flex justify-center place-items-center'>
                        <Twitter className='text-slate-500' />
                    </div>
                    <div className='w-[45px] h-[45px] rounded-[25px] bg-white flex justify-center place-items-center'>
                        <LinkedIn className='text-slate-500' />
                    </div>
                    <div className='w-[45px] h-[45px] rounded-[25px] bg-white flex justify-center place-items-center'>
                        <YouTube className='text-slate-500' />
                    </div>
                </div>
            </div>
        </div>
        <div className='bg-slate-300 h-[2px] w-[100%] mt-4'/>
        <div className='mt-2'>
            <p>© 2022 LAPO Microfinance Bank, Nigeria.</p>
        </div>
        <div className='mt-2'>
            <IconButton onClick={() => window.scrollTo(0,0)} className='w-[60px] h-[60px] rounded-[30px] shadow-md bg-white'>
                <KeyboardArrowUpIcon />
            </IconButton>
        </div>
    </div>
  )
}

export default Footer