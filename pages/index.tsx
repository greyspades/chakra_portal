import React, { useState, useEffect} from 'react'
import Axios from 'axios'
import { Formik } from 'formik'
import { Button, Input, InputAdornment, Accordion } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Navbar } from '../Components/navbar';
import Listings from './listings';
import { Search } from '../Components/search';

const Home = () => {
  const regex = /^[0-9\b]+$/;

  return (
    <div className='grid'>
      <div className='z-5 relative'>
      <Navbar />
      </div>
      <Listings />
      {/* <div className=''>
      </div> */}
    </div>
  )
}

export default Home