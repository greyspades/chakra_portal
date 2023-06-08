import React, { useState, useEffect} from 'react'
import Listings from './listings';

const Home = () => {
//* index component
  return (
    <div className='grid'>
      <Listings />
    </div>
  )
}

export default Home