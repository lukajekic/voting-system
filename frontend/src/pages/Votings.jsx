import { ChevronLeft, Component, PlusSquare, User, Vote } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import HalfView from '../components/HalfView'
import GroupCard from '../components/GroupCard'
import VotingCard from '../components/VotingCard'
import BackButton from '../components/BackButton'
import AccountDropdown from '../components/AccountDropdown'
import axios from 'axios'
import moment from 'moment-timezone'
  import { Bounce, ToastContainer, toast } from 'react-toastify';

const Votings = () => {
  const [group, setGroup] = useState("Odaberite grupu")
  const [votingslist, setVotingsList] = useState([])
  const [grouplist, setgrouplist] = useState([])
  const [createFom, setCreateForm] = useState({
    title: "",
    description: "",
    expiration: null,
    group: "Odaberite grupu"
  })

  const getVotings = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/voting?view=admin`)
      if (response.status === 200) {
        console.log(response.data)
        setVotingsList(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getGroups = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/group?view=admin`)
      if (response.status === 200) {
const groupnames = response.data
console.log(groupnames)
setgrouplist(groupnames)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async()=>{
    try {
      console.log(createFom)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/voting`, createFom)
      if (response.status === 201) {
location.href = `/voting/${response.data._id}`
      }
    } catch (error) {
      toast.error('Greška prilikom kreiranja glasanja!', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
transition: Bounce,
});
    }
  }

  useEffect(()=>{
    getGroups()
    getVotings()
  }, [])
  
  return (
    <div className="flex flex-col w-full h-[100vh] max-w-[1500px] m-auto ">
        <div className='p-6' id='hello'>
            <div className="flex w-full gap-5 items-center">
              <BackButton link={"/"}></BackButton>
                <div  className='squircle flex items-center justify-center rounded-[45px] bg-blue-200 text-blue-800 p-3 border-2 border-blue-800'><Vote className='size-8'></Vote></div>
                <div className="flex-1">
                    <h1 className="font-bold text-2xl text-black">Glasanja</h1>
                    <p>Ovde cete pronaci sva glasanja i postaviti nova</p>
                </div>
                

<button className="btn btn-primary" onClick={()=>{document.getElementById('newvoting').showModal()}}><PlusSquare></PlusSquare> Novo glasanje</button>
<AccountDropdown></AccountDropdown>
                    
                
            </div>
        </div>
               <select value={group} onChange={(e)=>{setGroup(e.target.value)}} defaultValue="Odaberite grupu" className="select mb-8 m-auto">
  <option disabled={true} value={"Odaberite grupu"}>Odaberite grupu</option>
  {grouplist.map(item2=>{
    return (
      <option>{item2.title}</option>
    )
  })}
</select>

        <div className='w-full flex flex-1 flex justify-center'>
       






<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-300 mb-5">
  {group === "Odaberite grupu" ? (
    <div className="flex flex-col w-full items-center mt-10">
      <Component className='size-12 text-gray-500'></Component>
      <span className='font-bold text-2xl'>Odaberite grupu za prikaz glasanja.</span>
    </div>
  ) : (
    <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Naziv</th>
        <th>Grupa</th>
        <th>Broj glasova</th>
        <th>Status</th>
        <th>Istek glasanja</th>
      </tr>
    </thead>
    <tbody>
   {votingslist.filter(item => item.group.title === group).map((item, index)=>{
    return (
         <tr className='clickable-row' onClick={()=>{location.href = `/voting/${item._id}`}}>
        <th>{index + 1}</th>
        <td>{item.title}</td>
        <td>{item.group.title}</td>
        <td>{item.votes?.length ?? 0}</td>
        <td>{item.status === "ready" ? (<div className='badge badge-info'>Nadolazeće</div>) : item.status === "running" ? (<div className='badge badge-warning'>U toku</div>) : item.status === "archived" ? (<div className='badge badge-secondary'>Završeno</div>) : (<div className='badge'>Nepoznat status</div>)}</td>
        <td>{moment(item.expiration).tz('Europe/Belgrade').format('DD. MM. YYYY. HH:mm')}</td>
      </tr>
    )
   })}
      
    </tbody>
  </table>
  )}
</div>


    </div>





    <dialog id="newvoting" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Novo glasanje</h3>
    <p className="py-4">Unesite osnovne informacije o glasanju.</p>
    <fieldset className="fieldset">
  <legend className="fieldset-legend" >Naziv glasanja</legend>
  <input type="text" className="input w-full" placeholder="" value={createFom.title} onChange={(e)=>{setCreateForm(prev =>({...prev, title: e.target.value}))}} />
</fieldset>

<fieldset className="fieldset">
  <legend className="fieldset-legend">Opis glasanja</legend>
<textarea  className="textarea w-full" placeholder="Opciono" value={createFom.description} onChange={(e)=>{setCreateForm(prev =>({...prev, description: e.target.value}))}}></textarea>
</fieldset>


     <fieldset className="fieldset">
  <legend className="fieldset-legend">Krajnji rok za glasanje</legend>
  <input type="datetime-local" className="input w-full" placeholder="" value={createFom.expiration} onChange={(e)=>{setCreateForm(prev =>({...prev, expiration: e.target.value}))}} />
</fieldset>

<fieldset className="fieldset">
  <legend className="fieldset-legend">Grupa</legend>
<select value={createFom.group} onChange={(e)=>{setCreateForm(prev => ({...prev, group: e.target.value}))}} defaultValue="Odaberite grupu" className="select mb-8 m-auto w-full">
  <option disabled={true} value={"Odaberite grupu"}>Odaberite grupu</option>
  {grouplist.map(item2=>{
    return (
      <option value={item2._id}>{item2.title}</option>
    )
  })}
</select>  
</fieldset>
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('newvoting').close()}}>Odustani</button>
        <button className="btn btn-primary" onClick={()=>{handleSubmit()}}>Sacuvaj</button>
       </div>
    </div>
  </div>
</dialog>





    </div>
    
  )
}

export default Votings