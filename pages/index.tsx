import React, { useState, useEffect} from 'react'
import Listings from './listings';
import Footer from '../components/footer';
import AppMonitor from '../components/AppMonitor';

const Home = () => {
//* index component
  return (
    <AppMonitor time={1800000}>
      <Listings />
      <div className=''>
        <Footer />
      </div>
    </AppMonitor>
  )
}

export default Home