import React from 'react'

const GroupCard = ({item}) => {
  return (
    <div onClick={()=>{location.href = `/member/group/${item._id}`}}>

        <div className="card w-80 bg-base-100 card-md shadow-sm">
  <div className="card-body">
    <h2 className="card-title">{item.title}</h2>
    <p>{item.description}</p>
    <div className="justify-end card-actions">
      <button className="btn btn-primary">Otvori</button>
    </div>
  </div>
</div>




    </div>
  )
}

export default GroupCard