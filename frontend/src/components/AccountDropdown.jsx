import axios from 'axios'
import { User } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const AccountDropdown = () => {
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
  const HandleLogout = async()=>{
    await axios.post(`${import.meta.env.VITE_BACKEND}/api/user/logout`)
    location.href = '/login'
  }



  return (
    <div>


        <div className="dropdown dropdown-end">
  <div tabIndex={0} role="button" className="btn m-1"><User></User>{profile.name}</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-60 p-6 shadow-sm">
    <div className='flex flex-col items-center w-fit'>
      <img src={`${import.meta.env.VITE_BACKEND}/api/user/avatar/${profile.profilepicture}`} alt="" className='size-15 rounded-full shadow-sm' />
      <h1 className="text-2xl font-semibold mt-3">{profile.name}</h1>
      <p className='text-[var(--color-secondary)]'>{profile.email}</p>
     <div className="w-fit gap-2 grid grid-cols-2 mt-3 pt-3 border-t border-[var(--color-secondary)]/30">
  <button
    className="btn btn-error"
    onClick={() => {
      HandleLogout()
    }}
  >
    Odjava
  </button>

  {/* Placeholder dugme – zauzima prostor ali se ne vidi */}
  <button className="btn invisible pointer-events-none">
    Placeholder
  </button>
</div>

    </div>
  </ul>

</div>
        


    </div>
  )
}

export default AccountDropdown