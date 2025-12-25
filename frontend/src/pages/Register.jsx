import axios from 'axios'
import { User, Lock, Mail } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
const [avatar, setAvatatr] = useState()


const checkLogin = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/user/me`)
      if (response.status === 200) {
location.href = '/'      
      }
    } catch (error) {
    }
  }

  useEffect(()=>{
    checkLogin()
  }, [])




const HandleRegister = async()=>{
  try {
    if (!email || !name || !password) {
      setError("Popunite sva polja.")
    } else {
      setError("")
    }
    const formdata = new FormData()
    formdata.append('name', name)
    formdata.append('email', email)
    formdata.append('password', password)
    formdata.append('profileimage', avatar)

    const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/user/register`, formdata)

    if (response.status === 201) {
      location.href = '/'
    }
  } catch (error) {
   console.error(error) 
   setError("Desila se greška.")
  }
}

  return (
    <div className='bg-pattern flex justify-center items-center  w-full h-[100vh]'>
      <div className="flex flex-col">
        {error && (
        <div className="w-full bg-red-600 mt-[20px] mb-5 p-2 border border-red-600 text-center text-white rounded">{error}</div>

        )}





<div className="h-137 w-100 bg-white rounded-lg shadow-md flex flex-col items-center">

    <h1 className="text-3xl font-bold mt-10">Registracija</h1>
    <p className='mt-2'>Imate nalog? <a href='/login'  className='text-[var(--color-primary)] underline'>Prijavite se</a></p>


    <label className="input validator mt-12">
  <User></User>
  <input
    type="text"
    required
    placeholder="Name"
    value={name}
    onChange={(e)=>{setName(e.target.value)}}
  />
</label>






<label className="input validator mt-8">
  <Mail></Mail>
  <input
    type="email"
    required
    placeholder="Email"
    value={email}
    onChange={(e)=>{setEmail(e.target.value)}}
  
  />
</label>


<label className="input validator mt-8">
  <Lock></Lock>
  <input
    type="password"
    required
    placeholder="Password"
    value={password}
    onChange={(e)=>{setPassword(e.target.value)}}

  />
</label>



<input onChange={(e)=>{setAvatatr(e.target.files[0])}} type="file" class="file-input mt-8" />

<button className="btn btn-primary w-80 mt-10" onClick={()=>{HandleRegister()}}>Prijava</button>


</div>




      </div>

        
    </div>
  )
}

export default Register