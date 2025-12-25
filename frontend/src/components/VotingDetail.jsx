import React from 'react'

const VotingDetail = ({title, value, icon}) => {
  return (
    <div className="detail w-[70%] bg-blue-100 rounded">
      <div className="w-full flex items-center gap-2 p-4">
        {icon}
        <div className="flex flex-col flex-1">
          <h1 className='text-lg font-bold text-blue-800'>{title}</h1>
          <p>{value}</p>
        </div>
      </div>
    </div>
  )
}

export default VotingDetail