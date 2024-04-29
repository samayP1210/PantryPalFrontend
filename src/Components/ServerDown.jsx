import React from 'react'
import OverComponent from './OverComponent'

function ServerDown() {
  return (
    <div className='section'>
      <OverComponent btn={'Reload'} heading={'503'} subHeading={'Server Down'} link={'/'}/>
    </div>
  )
}

export default ServerDown