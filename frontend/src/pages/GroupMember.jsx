import React, { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import { CircleCheck, CirclePile, CircleSlash, ClockAlert, ClockFading, Component, MessageCircleQuestionMark, PlusSquare, SatelliteDishIcon, Vote } from 'lucide-react'
import AccountDropdown from '../components/AccountDropdown'
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom'
import axios from 'axios'
  import { Bounce, ToastContainer, toast } from 'react-toastify';
import moment from 'moment-timezone'

const GroupMember = () => {
const [now, setNoew] = useState(moment.utc())
   const [profile, setprofile] = useState({})
  const getProfile = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/user/me`)
      if (response.status === 200) {
        setprofile(response.data)
      
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    getProfile()
  }, [])




    const socket = io(import.meta.env.VITE_BACKEND)


const [voted, setVoted] = useState(false)

  const [displayState, setDisplayState] = useState("")
  const [votingData, setVotingData] = useState({
    title: "Prvo glasanje"
  })
  const params = useParams()

const groupid = params.id




/*VAZNO*/
const VOTE = async()=>{
  try {
    let utc2 = moment.utc(votingData.expiration)
let now2 = moment.utc()

let isPast2 = utc2.isBefore(now2)
if (isPast2) {
  getVoting()
} else {
const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/voting/vote/${votingData._id}?optionID=${selectedOption}`)
    if (response.status === 200) {
      toast.success('Uspešno ste glasali!', {
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

getVoting()
document.getElementById('confirmvote').close()
    }
}
    
  } catch (error) {
    if (error.response.status === 400) {
       toast.error(error.response.data.message, {
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
    } else if (error.response.status === 500) {
      toast.error("Greška!", {
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
  }



useEffect(()=>{
  if (profile?.email) {
    getVoting()
  }
}, [profile])

const getVoting = async()=>{
  try {
    setNoew(moment.utc())
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/voting/group/${groupid}`)
    if (response.status === 200) {
      setDisplayState(response.data.view)
      if (response.data.view && response.data.view !== "none") {

    socket.emit("joinVoting", response.data.data._id)
    console.log("SOCKET POVEZAN NA GLASANJE")

        setVotingData(response.data.data)
        if (response.data.data.voted.includes(profile.email)) {
          setVoted(true)
        } else {
          setVoted(false)
        }
      }
    } else{
toast.error('Greška u prikazu podataka', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
transition: Bounce,
})
    }
  } catch (error) {
    toast.error('Greška u prikazu podataka', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
transition: Bounce,
})
  }
}



let utc = moment.utc(votingData.expiration)


let isPast = utc.isBefore(now)

console.log(isPast)





  socket.on("receiveSignal", (data)=>{
    console.log(data)
    if (data.type === "updateGroup") {
      getVoting()
    }
  })

  const [selectedOption, setSelectedOption] = useState("")
  return (
     <div className="flex flex-col w-full h-[100vh]  max-w-[1500px] m-auto">
        <div className='p-6' id='hello'>
            <div className="flex w-full gap-5 items-center">
              <BackButton link={"/"}></BackButton>
                <div  className='squircle flex items-center justify-center rounded-[45px] bg-blue-200 text-blue-800 p-3 border-2 border-blue-800'><CirclePile className='size-8'></CirclePile></div>
                <div className="flex-1">
                    <h1 className="font-bold text-2xl text-black">{votingData?.group?.title}</h1>
                </div>

<AccountDropdown></AccountDropdown>
                    
                
            </div>
        </div>
        <div className='w-full flex flex-1 flex justify-center'>
       
<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-300 mb-5">
  {displayState === "none" ? (
    <div className="flex flex-col w-full items-center mt-10">
          <CircleSlash className='size-12 text-gray-500'></CircleSlash>
          <span className='font-bold text-2xl mt-2'>U grupi još nisu održana glasanja.</span>
        </div>
  ) : displayState === "expired" ? (
    <div className="flex flex-col w-full items-center mt-10">
          <ClockAlert className='size-12 text-red-600'></ClockAlert>
          <span className='font-bold text-2xl mt-2'>Glasanje je završeno.</span>
          <span className='mt-3'>({votingData.title})</span>
        </div>
  ) : displayState === "upcoming" ? (
    <div className="flex flex-col w-full items-center mt-10">
          <ClockFading className='size-12 text-blue-800'></ClockFading>
          <span className='font-bold text-2xl mt-2'>Glasanje će biti održano.</span>
          <span className='mt-3'>({votingData.title})</span>
        </div>
  ) : displayState === "voting" ? (
   voted ? (
<div className="flex flex-col w-full items-center mt-10">
          <CircleCheck className='size-12 text-blue-800'></CircleCheck>
          <span className='font-bold text-2xl mt-2'>Uspešno ste glasali.</span>
          <span className='mt-3'>({votingData.title})</span>
        </div>
   ) : (
     isPast ? (
       <div className="flex flex-col w-full items-center mt-10">
          <ClockFading className='size-12 text-red-700'></ClockFading>
          <span className='font-bold text-2xl mt-2'>Poslednji rok za glasanje je prošao.</span>
          <span className='mt-3'>({votingData.title})</span>
        </div>
    ) : (
      <div className='w-full p-3'>
      <h1 className="text-2xl font-bold">Glasanje je otvoreno!</h1>
      <p className="w-full text-center">Glasate na temu:</p>
      <h1 className="text-2xl font-bold w-full text-center">{votingData.title}</h1>

      <div role="alert" className="alert alert-info mt-3">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
  <span>Instrukcije i detaljna objašnjenja opcija dobićete usmeno tokom glasanja ili pismeno. Kada donesete odluku, odaberite opciju i potvrdite izbor.</span>
</div>

<div id='votingoptions' className="w-full flex flex-wrap mt-3 gap-3">
{votingData.options.map((item, index)=>{
  return (
    <div key={index} onClick={()=>{setSelectedOption(item._id)}} className={`option w-70 p-5 text-lg font-semibold rounded-lg ${selectedOption === item._id ? ("active") : ("")}`}>
{item.text}
</div>
  )
})}

</div>



{selectedOption && (
  <button className="btn btn-primary mt-5 px-5" onClick={()=>{document.getElementById('confirmvote').showModal()}}>Glasaj</button>
)}


    </div>
    )
   )
  ) : (<></>)}
</div>


    </div>


      <dialog id="newmember" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Dodaj člana</h3>
    <p className="py-4">Unesite email člana.</p>
    <fieldset className="fieldset">
  <legend className="fieldset-legend">Email</legend>
  <input type="text" className="input w-full" placeholder="" />
</fieldset>
  
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn">Close</button>
        <button className="btn btn-primary">Sacuvaj</button>
       </div>
      </form>
    </div>
  </div>
</dialog>





      <dialog id="confirmvote" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Potvrda</h3>
    <div className="flex flex-col gap-2 items-center">
      <MessageCircleQuestionMark className='size-15 text-[var(--color-primary)]'></MessageCircleQuestionMark>
    <p className="py-4 w-full text-center">Da li potvrđujete svoj glas?</p>
    </div>
  
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('confirmvote').close()}}>Odustani</button>
        <button className="btn btn-primary" onClick={()=>{VOTE()}}>Potvrdi glas</button>
       </div>
    </div>
  </div>
</dialog>


    </div>
  )
}

export default GroupMember