import React, { useState, useEffect} from 'react'
import Axios from 'axios'
import { Formik } from 'formik'
import { Button, Input, InputAdornment, Accordion } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Navbar } from '../components/navbar';
import Listings from './listings';

const Home = () => {

  return (
    <div className='grid'>
      <div className='z-5 relative'>
      </div>
      <Listings />
    </div>
  )
}

export default Home