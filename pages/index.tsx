import React, { useState, useEffect} from 'react'
import Listings from './listings';
import Footer from '../components/footer';

const Home = () => {
//* index component
  return (
    <div className=''>
      <Listings />
      <div className=''>
        <Footer />
      </div>
    </div>
  )
}

export default Home