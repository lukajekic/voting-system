import React, { useState } from 'react'
import BackButton from '../components/BackButton'
import { Baseline, Calendar, CirclePile, CircleQuestionMark, Component, Play, PlugZap, PlusSquare, Square, Trash, User, Vote } from 'lucide-react'
import AccountDropdown from '../components/AccountDropdown'
import VotingDetail from '../components/VotingDetail'
import Chart from 'react-apexcharts'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment-timezone'
import { useEffect } from 'react'
import {io} from 'socket.io-client'
const EditVoting = () => {
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
const params = useParams()
const [votingData, setVotingData] = useState({})
const [editData, setEditData] = useState({})
const votingid = params.id

const getVoting = async()=>{
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/voting/${votingid}`)
    if (response.status === 200) {
setVotingData(response.data)
setEditData({
  title: response.data.title,
  description: response.data.description,
  expiration: moment(response.data.expiration).local().format("YYYY-MM-DDTHH:mm")
})
    }
  } catch (error) {
    console.error(error)
  }
}

const IncrementChartVote = (optionid) =>{
  setVotingData(prev=>({
    ...prev,
    options: prev.options.map(opt => opt._id === optionid ? {...opt, votes: opt.votes + 1} : opt)
  }))

} 

useEffect(()=>{
    console.log(votingData)

}, [votingData])
useEffect(() => {
  getVoting()
  
  const socket = io(import.meta.env.VITE_BACKEND)
  
  socket.on("connect", () => {
    socket.emit("joinVoting", votingid)
    console.log("PRIDRUZEN SOBI GLASANJA")
  })

  socket.on("receiveSignal", (data) => {
    console.log(data)
    if (data.type === "updateStats") {
      IncrementChartVote(data.optionid)
    }
  })

  return () => {
    socket.disconnect()
  }
}, [])

const series = [{
  data: votingData?.options?.map(item => item.votes)
}];

const options = {
  chart: {
    type: 'bar',
    height: 350,
  },
  colors: [primaryColor],
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: true,
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: votingData?.options?.map(item => item.text),
  }
};


const CreateOption = async()=>{
  if (newoptiontitle) {
    try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/voting/options/${votingid}?action=add&title=${newoptiontitle}`)
    if (response.status === 200) {
document.getElementById('newoption').close()
getVoting()
setnewoptiontitle("")
    }
  } catch (error) {
    console.error(error)
  }
  }
}




const deleteOption = async()=>{
  if (optiondeletionID) {
    try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/voting/options/${votingid}?action=remove&optionID=${optiondeletionID}`)
    if (response.status === 200) {
document.getElementById('deleteoption').close()
getVoting()
setoptiondeletionID("")
    }
  } catch (error) {
    console.error(error)
  }
  }
}




const HandleVotingEdit = async()=>{
    try {
    const dataToSend = {
      ...editData,
      expiration: moment(editData.expiration).utc().toISOString()
    }
    const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/voting/${votingid}`, dataToSend)
    if (response.status === 200) {
document.getElementById('editvoting').close()
getVoting()
    }
  } catch (error) {
    console.error(error)
  }
  
}




const HandleStatusChange = async(status, modal)=>{
    try {
      const toEdit = {
        status: status
      }
    const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/voting/${votingid}`, toEdit)
    if (response.status === 200) {
document.getElementById(modal).close()
getVoting()
 await axios.post(`${import.meta.env.VITE_BACKEND}/api/socket/sendsignal`, {
    "votingID": votingid,
    "signal": {
        "type": "updateGroup"
          }
})


    }
  } catch (error) {
    console.error(error)
  }
  
}


const HandleVotingDeletion = async()=>{
    try {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND}/api/voting/${votingid}`)
    if (response.status === 200) {
location.href = '/votings'
    }
  } catch (error) {
    console.error(error)
  }
  
}



  const [status, setStatus] = useState("")
  const [newoptiontitle, setnewoptiontitle] = useState("")
  const [optiondeletionID, setoptiondeletionID] = useState("")
  return (
     <div className="flex flex-col w-full h-[100vh]  max-w-[1500px] m-auto">
        <div className='p-6' id='hello'>
            <div className="flex w-full gap-5 items-center">
              <BackButton link={"/votings"}></BackButton>
                <div  className='squircle flex items-center justify-center rounded-[45px] bg-blue-200 text-blue-800 p-3 border-2 border-blue-800'><Vote className='size-8'></Vote></div>
                <div className="flex-1">
                    <h1 className="font-bold text-2xl text-black">{votingData?.title}</h1>
                    <p>Kreirano: {moment(votingData?.createdAt).tz("Europe/Belgrade").format("DD. MM. YYYY. HH:mm")}</p>
                </div>
{votingData.status === "ready" ? (                <button className="btn btn-success" onClick={()=>{document.getElementById('confirmstart').showModal()}}><Play></Play> Započni glasanje</button>
): votingData.status === "running" ? (                <button className="btn btn-error text-white" onClick={()=>{document.getElementById('confirmend').showModal()}}><Square></Square> Zaustavi glasanje</button>
): votingData.status === "archived" ? (                <></>
): (<></>)}


{(votingData && votingData?.status === "ready") && (
  <details className="dropdown">
  <summary className="btn m-1"><PlusSquare></PlusSquare> Opcije</summary>
  <ul className="menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm">
    <li onClick={()=>{document.getElementById('newoption').showModal()}}><a>Dodaj opciju za glasanje</a></li>
    <li onClick={()=>{document.getElementById('editvoting').showModal()}}><a>Izmeni glasanje</a></li>
    <li onClick={()=>{document.getElementById('deletevoting').showModal()}}><a>Obriši glasanje</a></li>
  </ul>
</details>
)}


<AccountDropdown></AccountDropdown>
                    
                
            </div>
        </div>
        <div className='w-full flex flex-1 flex justify-center'>
       
<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-300 mb-5">
 <div className="w-full flex h-[100%]">
  <div className="h-full flex-1 flex flex-col items-center pt-5 gap-2 border-r border-[#cecece]/30">
                        <h1 className="font-bold text-2xl text-black mb-2">Osnovni podaci</h1>

    <VotingDetail title={"Naziv glasanja"} value={votingData?.title} icon={<Baseline className='size-8 text-blue-800'></Baseline>}></VotingDetail>
        <VotingDetail title={"Autor"} value={votingData?.owner?.name} icon={<User className='size-8 text-blue-800'></User>}></VotingDetail>

    <VotingDetail title={"Datum kreiranja"} value={moment(votingData?.createdAt).tz('Europe/Belgrade').format("DD. MM. YYYY. HH:mm")} icon={<Calendar className='size-8 text-blue-800'></Calendar>}></VotingDetail>

    <VotingDetail title={"Rok za glasanje"} value={moment(votingData?.expiration).tz('Europe/Belgrade').format("DD. MM. YYYY. HH:mm")} icon={<Calendar className='size-8 text-blue-800'></Calendar>}></VotingDetail>

  </div>
  {status === "ready" ? (<></>) : (
    <div className=" h-full flex-1">
<Chart options={options} series={series} type="bar" height="100%" width="100%" />
  </div>
  )}
  <div className=" h-full flex-1 border-l border-[#cecece]/30">
  <table className="table table-auto">
    {/* head */}
    <thead>
      <tr>
        <th className='w-fit'></th>
        <th>Opcija</th>
        {(votingData && votingData?.status === "ready") && (
<th>Brisanje

        </th>
        )}
        
      </tr>
    </thead>
    <tbody>
     {votingData?.options?.map((item, index)=>{
      return (
        <tr>
        <th className='w-[30px]'>{index + 1}</th>
        <td>{item.text}</td>
        {(votingData && votingData?.status === "ready") && (
        <td className='w-10'><button className='btn  btn-error  w-10 p-0 flex items-center justify-center' onClick={()=>{[setoptiondeletionID(item._id), document.getElementById('deleteoption').showModal()]}}><Trash></Trash></button></td>

        )}

      </tr>
      )
     })}
    </tbody>
  </table>
  </div>
</div>

</div>


    </div>


      <dialog id="confirmstart" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Potvrda</h3>
    <div className="w-full flex flex-col gap-2 items-center mt-4">
      <CircleQuestionMark className='size-15 text-[var(--color-primary)]'></CircleQuestionMark>
    <p className="py-4 w-full text-center">Da li ste sigurni da zelite zapoceti glasanje?</p>

    </div>

  
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('confirmstart').close()}}>Zatvori</button>
        <button className="btn btn-primary" onClick={()=>{HandleStatusChange("running", "confirmstart")}}>Zapocni</button>
       </div>
    </div>
  </div>
</dialog>




      <dialog id="confirmend" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Potvrda</h3>
    <div className="w-full flex flex-col gap-2 items-center mt-4">
      <CircleQuestionMark className='size-15 text-[var(--color-error)]'></CircleQuestionMark>
    <p className="py-4 w-full text-center">Da li ste sigurni da zelite zaustaviti glasanje?</p>

    </div>

  
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('confirmend').close()}}>Zatvori</button>
        <button className="btn btn-error" onClick={()=>{HandleStatusChange("archived", "confirmend")}}>Zaustavi</button>
       </div>
    </div>
  </div>
</dialog>




<dialog id="deletevoting" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Potvrda</h3>
    <div className="w-full flex flex-col gap-2 items-center mt-4">
      <Trash className='size-15 text-[var(--color-error)]'></Trash>
    <p className="py-4 w-full text-center">Da li ste sigurni da zelite obrisati glasanje?</p>

    </div>

  
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('deletevoting').close()}}>Odustani</button>
        <button className="btn btn-error" onClick={()=>{HandleVotingDeletion()}}>Obiši</button>
       </div>
    </div>
  </div>
</dialog>





  <dialog id="newoption" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Nova opcija</h3>
    <p className="py-4">Unesite osnovne informacije o opciji.</p>
    <fieldset className="fieldset">
  <legend className="fieldset-legend"  >Naziv opcije</legend>
  <input type="text" className="input w-full" placeholder="" value={newoptiontitle} onChange={(e)=>{setnewoptiontitle(e.target.value)}}  />
</fieldset>



    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('newoption').close()}}>Odustani</button>
        <button className="btn btn-primary" onClick={()=>{CreateOption()}}>Sacuvaj</button>
       </div>
    </div>
  </div>
</dialog>






    <dialog id="deleteoption" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Potvrda</h3>
    <div className="w-full flex flex-col gap-2 items-center mt-4">
      <Trash className='size-15 text-[var(--color-error)]'></Trash>
    <p className="py-4 w-full text-center">Da li ste sigurni da zelite obrisati opciju?</p>

    </div>

  
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('deleteoption').close()}}>Odustani</button>
        <button className="btn btn-error" onClick={()=>{deleteOption()}}>Obriši</button>
       </div>
      </form>
    </div>
  </div>
</dialog>







  <dialog id="editvoting" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Izmeni glasanje</h3>
    <p className="py-4">Unesite osnovne informacije o glasanju.</p>
    <fieldset className="fieldset">
  <legend className="fieldset-legend" >Naziv glasanja</legend>
  <input type="text" className="input w-full" placeholder="" value={editData.title} onChange={(e)=>{setEditData(prev =>({...prev, title: e.target.value}))}} />
</fieldset>

<fieldset className="fieldset">
  <legend className="fieldset-legend">Opis glasanja</legend>
<textarea  className="textarea w-full" placeholder="Opciono" value={editData.description} onChange={(e)=>{setEditData(prev =>({...prev, description: e.target.value}))}}></textarea>
</fieldset>


     <fieldset className="fieldset">
  <legend className="fieldset-legend">Krajnji rok za glasanje</legend>
  <input type="datetime-local" className="input w-full" placeholder="" value={editData.expiration} onChange={(e)=>{setEditData(prev =>({...prev, expiration: e.target.value}))}} />
</fieldset>


    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('editvoting').close()}}>Odustani</button>
        <button className="btn btn-primary" onClick={()=>{HandleVotingEdit()}}>Sacuvaj</button>
       </div>
    </div>
  </div>
</dialog>





    </div>
  )
}

export default EditVoting