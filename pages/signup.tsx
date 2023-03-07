import React, { useState, useEffect} from 'react'
import Axios from 'axios'
import { Formik } from 'formik'
import { Button, Input, InputAdornment } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';


const Signup = () => {

  const regex = /^[0-9\b]+$/;

  return (
    <div className='grid grid-cols-2'>
      <div className='grid'>

      </div>
      <div className='grid w-[400px] h-[600px] bg-slate-100 rounded-md p-8'>
        {/* <h3>
          Recruitment Portal
        </h3> */}
        <div className='grid justify-center'>
        <form >
          <Formik initialValues={{firstname: '', lastName: '', email: '', phoneNumber: ''}} onSubmit={(value) => {
            // if()
          }}>
            {({handleChange, handleSubmit, values}) => (
              <div className='grid grid-rows-5 justify-between h-[300px]'>
                <div >
                <Input
                  placeholder = 'Firstname'
                  value = {values.firstname}
                  onChange = {handleChange('firstname')}
                  className='bg-white rounded-md h-[40px] w-[300px] p-4'
                  startAdornment={
                    <InputAdornment position='start'>
                      <PersonIcon />
                    </InputAdornment>
                  }
                />
              </div>

              <div >
                <Input
                  placeholder = 'Lastname'
                  value = {values.lastName}
                  onChange = {handleChange('lastName')}
                  className='bg-white rounded-md h-[40px] w-[300px] p-4'
                  startAdornment={
                    <InputAdornment position='start'>
                      <PersonIcon />
                    </InputAdornment>
                  }
                />
              </div>

              <div >
                <Input
                  placeholder = 'Email Address'
                  value = {values.email}
                  onChange = {handleChange('email')}
                  className='bg-white rounded-md h-[40px] w-[300px] p-4'
                  startAdornment={
                    <InputAdornment position='start'>
                      <EmailIcon />
                    </InputAdornment>
                  }
                />
              </div>

              <div >
                <Input
                  onKeyDown={(e) => {

                  }}
                  
                  placeholder = 'Phone Number'
                  value = {values.phoneNumber}
                  onChange = {(e) => {
                    if(regex.test(e.target.value)) {
                      handleChange('phoneNumber')
                    }
                    else {
                      e.preventDefault
                    }
                  }}
                  className = 'bg-white rounded-md h-[40px] w-[300px] p-4'
                  type = 'number'
                  startAdornment = {
                    <InputAdornment position='start'>
                      <PhoneIcon />
                    </InputAdornment>
                  }
                />
              </div>
                  <div className='grid justify-center'>
                  <Button style={{backgroundColor: '#2BAD6A'}} variant='contained' className='grid bg-[#2BAD6A] w-[100px] h-[40px] text-white' onClick={() => handleSubmit}>
                    Submit
                  </Button>
                  </div>
              </div>
            )}
          </Formik>
        </form>
        </div>
      </div>
    </div>
  )
}

export default Signup