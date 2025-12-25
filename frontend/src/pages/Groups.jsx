import { ChevronLeft, Component, PlusSquare, User } from 'lucide-react'
import React from 'react'
import HalfView from '../components/HalfView'
import GroupCard from '../components/GroupCard'
import VotingCard from '../components/VotingCard'
import BackButton from '../components/BackButton'
import AccountDropdown from '../components/AccountDropdown'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import moment from 'moment-timezone'
import { useParams } from 'react-router-dom'

const Groups = () => {
const [groupslist, setgroupslist] = useState([])
const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const urlParams = new URLSearchParams(window.location.search);
const view = urlParams.get('view') || "admin"
console.log(view)
useEffect(()=>{
  getGroups()
}, [])


const HandleSubmit = async()=>{
try {
  if (title) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/group`, {
    title, description
  })

  if (response.status === 201) {
location.href = `/group/${response.data._id}`
  }
  } else {
    console.error("NEOPHODAN NASLOV")
  }
} catch (error) {
  console.error(error)
}
}
  const getGroups = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/group?view=${view}`)
      if (response.status === 200) {
setgroupslist(response.data)
if (response.data.length === 0 && view === "admin") {
  location.href = '/groups?view=member'
}
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="flex flex-col w-full h-[100vh]  max-w-[1500px] m-auto">
        <div className='p-6' id='hello'>
            <div className="flex w-full gap-5 items-center">
              <BackButton link={"/"}></BackButton>
                <div  className='squircle flex items-center justify-center rounded-[45px] bg-blue-200 text-blue-800 p-3 border-2 border-blue-800'><Component className='size-8'></Component></div>
                <div className="flex-1">
                    <h1 className="font-bold text-2xl text-black">Grupe</h1>
                    <p>Ovde cete pronaci sve grupe u okviru kojih mozete postaviti glasanja</p>
                </div>

                

<div className="dropdown dropdown-start">
  <div tabIndex={0} role="button" className="btn m-1">Prikaz grupa</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
{/*     <li><a href='/groups?view=all'>Prikaži sve</a></li>
 */}    <li><a href='/groups?view=admin'>Uloga: Administrator</a></li>
    <li><a href='/groups?view=member'>Uloga: Član</a></li>
  </ul>
</div>



                <button className="btn btn-primary" onClick={()=>{document.getElementById('newgroup').showModal()}}><PlusSquare></PlusSquare> Nova grupa</button>

<AccountDropdown></AccountDropdown>
                    
                
            </div>
        </div>
        <div className='w-full flex flex-1 flex justify-center'>
       
       
<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-300 mb-5">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Naziv</th>
        <th className="text-center">Broj članova</th>
<th className="text-center">Broj administratora</th>

        <th>Kreirana</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {groupslist.map((item, index)=>{
        return (
<tr 
  key={item._id} 
  className='clickable-row' 
  onClick={() => {
    if (view === "admin") {
      location.href = `/group/${item._id}`;
    } else if (view === "member") {
      location.href = `/member/group/${item._id}`;
    }
  }}
>
        <th>{index + 1}</th>
        <td>{item.title}</td>
        <td className='text-center'><div className="badge badge-success">{item.members.length}</div></td>
        <td className='text-center'><div className="badge">{item.admins.length}</div></td>
        <td>{moment(item.createdAt).tz("Europe/Belgrade").format("DD. MM. YYYY. HH:mm")}</td>
      </tr>
        )
      })}
      {/* row 2 */}

    </tbody>
  </table>
</div>


    </div>


      <dialog id="newgroup" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Nova grupa</h3>
    <p className="py-4">Unesite osnovne informacije o grupi.</p>
    <fieldset className="fieldset">
  <legend className="fieldset-legend">Naziv grupe</legend>
  <input value={title} onChange={(e)=>{setTitle(e.target.value)}} type="text" className="input w-full" placeholder="" />
</fieldset>


<fieldset className="fieldset">
  <legend className="fieldset-legend">Opis grupe</legend>
<textarea value={description} onChange={(e)=>{setDescription(e.target.value)}} className="textarea w-full" placeholder="Opciono"></textarea>
</fieldset>


  
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn">Odustani</button>
        <button className="btn btn-primary" type='button' onClick={(e)=>{HandleSubmit()}}>Sačuvaj</button>
       </div>
    </div>
  </div>
</dialog>



    </div>
    
  )
}

export default Groups