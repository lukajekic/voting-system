import { Calendar, Component } from 'lucide-react'
import React from 'react'
import moment from 'moment-timezone'

const VotingCard = ({item}) => {
  return (
    <div className='pb-4'>

        <div className="card w-160 bg-base-100 card-md shadow-sm">
  <div className="card-body">
    <h2 className="card-title">{item.title}</h2>
    <span className='flex inline-flex gap-2 items-center'><Component></Component><span className='flex-1 break-normal'>{item.group.title}</span></span>
        <span className='flex inline-flex gap-2 items-center'><Calendar></Calendar><span className='flex-1 break-normal'>{moment(item.expiration).tz('Europe/Belgrade').format("DD. MM. YYYY. HH:mm")}</span></span>

    <div className="justify-end card-actions">
      <button className='btn btn-primary'>Otvori</button>
    </div>
  </div>
</div>




    </div>
  )
}

export default VotingCard