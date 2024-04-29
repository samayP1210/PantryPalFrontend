import React from 'react'
import OverComponent from './OverComponent'

function NotFound() {
  return (
    <div className='section'>
      <OverComponent btn={'Return Home'} heading={'404'} subHeading={'Page Not Found'} link={'/'}/>
    </div>
  )
}

export default NotFound