import axios from 'axios'
import { User, Lock, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { useEffect } from 'react'

const Login = () => {
  const [email, setemail] = useState("")
  const [password, setPassword] = useState("")
const [error, setError] = useState("")


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


  const HandleLogin = async()=>{
   try {
    if (!email || !password) {
      setError("Popunite sva polja")
    } else {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/user/login`, {
      email, password
    })

    if (response.status === 200) {
      location.href = "/"
    }
    }
    
     
   } catch (error) {
    if (error.status === 400) {
      console.log(error.response.data.message)
      setError(error.response.data.message)
    }
   }
  }
  return (
    <div className='bg-pattern flex justify-center items-center  w-full h-[100vh]'>
<div className="flex flex-col">



{error && (
        <div className="w-full bg-red-600 mt-[20px] mb-5 p-2 border border-red-600 text-center text-white rounded">{error}</div>

        )}


  <div className="h-100 w-100 bg-white rounded-lg shadow-md flex flex-col items-center">
    <h1 className="text-3xl font-bold mt-10">Prijava</h1>
    <p className='mt-2'>Nemate nalog? <a href='/register'  className='text-[var(--color-primary)] underline'>Registrujte se</a></p>


    <label className="input validator mt-12">
  <Mail></Mail>
  <input
    type="email"
    required
    placeholder="Email"
value={email}
onChange={(e)=>{setemail(e.target.value)}}
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



<button className="btn btn-primary w-80 mt-10" onClick={()=>{HandleLogin()}}>Prijava</button>


</div>
</div>
        
    </div>
  )
}

export default Login