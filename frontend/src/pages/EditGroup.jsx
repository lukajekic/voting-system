import React from 'react'
import BackButton from '../components/BackButton'
import { CirclePile, Component, Pencil, PlusSquare, ShieldUser, Trash, User, Users } from 'lucide-react'
import AccountDropdown from '../components/AccountDropdown'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import moment from 'moment-timezone'
  import { Bounce, ToastContainer, toast } from 'react-toastify';

const EditGroup = () => {
  const [edit, setEdit] = useState(false)
  const [groupData, setGroupData] = useState({})
  const params = useParams()
  const [modalState, setModalState] = useState("prompt")
  const [modalemail, setmodalemail] = useState("")
  const [confirmuserinfo, setconfirmuserinfo] = useState({})


    const [adminmodalState, setadminModalState] = useState("prompt")
  const [adminmodalemail, setadminmodalemail] = useState("")
  const [adminconfirmuserinfo, setadminconfirmuserinfo] = useState({})

  const [editgrouptitle, seteditgrouptitle] = useState("")
  const [editgroupdesc, seteditgroupdesc] = useState("")


  const [deletionID, setDeletionID] = useState("")
  const groupid = params.id
  const getGroup = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/group/${groupid}`)
      if (response.status === 200) {
                console.log(response.data)

        setGroupData(response.data)
        seteditgrouptitle(response.data.group.title)
        seteditgroupdesc(response.data.group.description)
      }
    } catch (error) {
      console.error(error)
    }
  }


  const handleConfirmation = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/user/confirm/${modalemail}`)
      if (response.status === 200) {
if (groupData.members.map(item => item.email).includes(modalemail)) {
  console.log("KORISNIK JE VEC DODAT")
  toast.error('Korisnik je već dodat!', {
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
} else {
  setconfirmuserinfo(response.data)
setModalState("confirmation")
}
      }
    } catch (error) {
      if (error.response.status && error.response.status === 400) {
        console.log(error.response.data.message)
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
      }
    }
  }




  const handleAdminConfirmation = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/user/confirm/${adminmodalemail}`)
      if (response.status === 200) {
if (groupData.admins.map(item => item.email).includes(adminmodalemail)) {
  console.log("admin JE VEC DODAT")
  toast.error('Administrator je već dodat!', {
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
} else {
  setadminconfirmuserinfo(response.data)
setadminModalState("confirmation")
}
      }
    } catch (error) {
      if (error.response.status && error.response.status === 400) {
        console.log(error.response.data.message)
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
      }
    }
  }



const handleDeletion = async()=>{
  try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/group/people/${groupData.group._id}?action=remove&sector=member&email=${deletionID}`)
      if (response.status === 200) {
        await getGroup()
        document.getElementById('deletemember').close()
      }
  } catch (error) {
    document.getElementById('deletemember').close()
      toast.error("Desila se greška", {
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



const handleAdminDeletion = async()=>{
  try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/group/people/${groupData.group._id}?action=remove&sector=admin&email=${deletionID}`)
      if (response.status === 200) {
        await getGroup()
        document.getElementById('deleteadmin').close()
      }
  } catch (error) {
    document.getElementById('deleteadmin').close()
      toast.error("Desila se greška", {
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



  const AddMember = async()=>{
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/group/people/${groupData.group._id}?action=add&sector=member&email=${modalemail}`)
      if (response.status === 200) {
        await getGroup()
        document.getElementById('newmember').close()
        setModalState("prompt")
      }
    } catch (error) {
      document.getElementById('newmember').close()
      toast.error("Desila se greška", {
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




  const AddAdmin = async()=>{
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/group/people/${groupData.group._id}?action=add&sector=admin&email=${adminmodalemail}`)
      if (response.status === 200) {
        await getGroup()
        document.getElementById('newadmin').close()
        setadminModalState("prompt")
      }
    } catch (error) {
      document.getElementById('newadmin').close()
      toast.error("Desila se greška", {
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


const HandleGroupEdit = async()=>{
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/group/${groupData.group._id}`, {
      title: editgrouptitle,
      description: editgroupdesc
    })

    if (response.status === 200) {
      toast.success('Uspešna izmena grupe!', {
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

getGroup()
document.getElementById('editgroup').close()
    }
  } catch (error) {
    console.error(error)
  }
}

  useEffect(()=>{
    getGroup()
  }, [])
  return (
     <div className="flex flex-col w-full h-[100vh]  max-w-[1500px] m-auto">
        <div className='p-6' id='hello'>
            <div className="flex w-full gap-5 items-center">
              <BackButton link={"/groups"}></BackButton>
                <div  className='squircle flex items-center justify-center rounded-[45px] bg-blue-200 text-blue-800 p-3 border-2 border-blue-800'><CirclePile className='size-8'></CirclePile></div>
                <div className="flex-1">
                    <h1 className="font-bold text-2xl text-black">{groupData?.group?.title}</h1>
                    <p>Kreirano: {moment(groupData?.group?.createdAt).tz('Europe/Belgrade').format('DD. MM. YYYY. HH:mm')}</p>
                </div>
                <button className="btn" onClick={()=>{document.getElementById('editgroup').showModal()}}><Pencil></Pencil> Izmeni grupu</button>

                <button className="btn btn-primary" onClick={()=>{document.getElementById('newmember').showModal()}}><PlusSquare></PlusSquare> Dodaj člana</button>

<AccountDropdown></AccountDropdown>
                    
                
            </div>
            <p className='break-normal mt-3'>{groupData?.group?.description}</p>
        </div>

        <div className='w-full flex flex-1 flex justify-center'>
       
<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-300 mb-5">
<div className="w-full border-b border-[#cecece] flex gap-4 p-4 items-center">
<ShieldUser className='size-7'></ShieldUser>
<span className='text-lg font-bold'>Administratori</span>
</div>
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Ime i prezime</th>
        <th>Email</th>
        <th>Akcije</th>
      </tr>
    </thead>
    <tbody>
    {groupData?.admins?.map((item, index)=>{
      return (
        <tr>
          <th>{index + 1}</th>
      
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item._id !== groupData?.group?.owner ? (<button onClick={()=>{[setDeletionID(item.email), document.getElementById('deleteadmin').showModal()]}} className='btn btn-error w-10 p-0 flex items-center justify-center'><Trash></Trash></button>) : (<></>)}</td>
      </tr>
      )
    })}
    </tbody>
  </table>


<div className="w-full border-b border-t border-[#cecece] flex gap-4 p-4 items-center">
<Users className='size-7'></Users>
<span className='text-lg font-bold'>Članovi</span>
</div>
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Ime i prezime</th>
        <th>Email</th>
        <th>Akcije</th>
      </tr>
    </thead>
    <tbody>
    {groupData?.members?.map((item, index)=>{
      return (
        <tr>
          <th>{index + 1}</th>
      
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td><button onClick={()=>{[setDeletionID(item.email), document.getElementById('deletemember').showModal()]}} className='btn btn-error w-10 p-0 flex items-center justify-center'><Trash></Trash></button></td>
      </tr>
      )
    })}
    </tbody>
  </table>



</div>


    </div>


      <dialog id="newmember" className="modal">
  <div className="modal-box">
   {modalState === "prompt" ? (
    <>
     <h3 className="font-bold text-lg">Dodaj člana</h3>
    <p className="py-4">Unesite email člana.</p>
    <fieldset className="fieldset">
  <legend className="fieldset-legend">Email</legend>
  <input type="text" value={modalemail} onChange={(e)=>{setmodalemail(e.target.value)}} className="input w-full" placeholder="" />
</fieldset>
  
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('newmember').close()}}>Odustani</button>
        <button className="btn btn-primary" onClick={()=>{handleConfirmation()}}>Sacuvaj</button>
       </div>
    </div>
    </>
   ) : modalState === "confirmation" ? (<>
    <h3 className="font-bold text-lg">Potvrdi unos</h3>
    <p className="py-4">Potvrdite unos člana.</p>
    <div className="flex w-full gap-4">
            <img src={`${import.meta.env.VITE_BACKEND}/api/user/avatar/${confirmuserinfo.profilepicture}`} alt="" className='size-15 rounded-full shadow-sm' />
            <div className="flex flex-col flex-1">
              <h1 className="text-2xl font-bold break-normal">{confirmuserinfo.name}</h1>
              <p>{confirmuserinfo.email}</p>
            </div>

    </div>
  
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{[setmodalemail(""), setModalState("prompt")]}}>Odustani</button>
        <button className="btn btn-primary" onClick={()=>{AddMember()}}>Sacuvaj</button>
       </div>
    </div>
   </>) : (<></>)}
  </div>
</dialog>





  <dialog id="newadmin" className="modal">
  <div className="modal-box">
   {adminmodalState === "prompt" ? (
    <>
     <h3 className="font-bold text-lg">Dodaj administratora</h3>
    <p className="py-4">Unesite email administratora.</p>
    <fieldset className="fieldset">
  <legend className="fieldset-legend">Email</legend>
  <input value={adminmodalemail} onChange={(e)=>{setadminmodalemail(e.target.value)}} type="text"  className="input w-full" placeholder="" />
</fieldset>
  
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{document.getElementById('newadmin').close()}}>Odustani</button>
        <button className="btn btn-primary" onClick={()=>{handleAdminConfirmation()}}>Sacuvaj</button>
       </div>
    </div>
    </>
   ) : adminmodalState === "confirmation" ? (<>
    <h3 className="font-bold text-lg">Potvrdi unos</h3>
    <p className="py-4">Potvrdite unos administratora.</p>
    <div className="flex w-full gap-4">
            <img src={`${import.meta.env.VITE_BACKEND}/api/user/avatar/${adminconfirmuserinfo.profilepicture}`} alt="" className='size-15 rounded-full shadow-sm' />
            <div className="flex flex-col flex-1">
              <h1 className="text-2xl font-bold break-normal">{adminconfirmuserinfo.name}</h1>
              <p>{adminconfirmuserinfo.email}</p>
            </div>

    </div>
  
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
       <div className="flex gap-2">
         <button className="btn" onClick={()=>{[setadminmodalemail(""), setadminModalState("prompt")]}}>Odustani</button>
        <button className="btn btn-primary" onClick={()=>{AddAdmin()}}>Sacuvaj</button>
       </div>
    </div>
   </>) : (<></>)}
  </div>
</dialog>



<dialog id="deletemember" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Obriši člana</h3>
    <p className="py-4">Da li ste sigurni da želite obrisati člana iz grupe?</p>
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
        <button onClick={()=>{document.getElementById('deletemember').close()}} className="btn">Odustani</button>
                <button onClick={()=>{handleDeletion()}} className="btn btn-error">Obriši</button>

    </div>
  </div>
</dialog>




<dialog id="deleteadmin" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Obriši administratora</h3>
    <p className="py-4">Da li ste sigurni da želite obrisati administratora iz grupe?</p>
    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
        <button onClick={()=>{document.getElementById('deleteadmin').close()}} className="btn">Odustani</button>
                <button onClick={()=>{handleAdminDeletion()}} className="btn btn-error">Obriši</button>

    </div>
  </div>
</dialog>



<dialog id="editgroup" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Izmeni grupu</h3>
                    <button className="btn btn-primary my-4" onClick={()=>{document.getElementById('newadmin').showModal()}}><PlusSquare></PlusSquare> Dodaj administratora</button>

    <fieldset className="fieldset">
  <legend className="fieldset-legend">Naziv grupe</legend>
  <input value={editgrouptitle} onChange={(e)=>{seteditgrouptitle(e.target.value)}}    type="text" className="input w-full" placeholder="" />
</fieldset>


<fieldset className="fieldset">
  <legend className="fieldset-legend">Opis grupe</legend>
<textarea value={editgroupdesc} onChange={(e)=>{seteditgroupdesc(e.target.value)}} className="textarea w-full" placeholder="Opciono"></textarea>
</fieldset>


    <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
        <button onClick={()=>{document.getElementById('editgroup').close()}} className="btn">Odustani</button>
                <button onClick={()=>{HandleGroupEdit()}} className="btn btn-primary">Sačuvaj</button>

    </div>
  </div>
</dialog>


    </div>
  )
}

export default EditGroup