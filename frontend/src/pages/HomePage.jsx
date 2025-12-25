import { Component, User, Vote } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import HalfView from '../components/HalfView'
import GroupCard from '../components/GroupCard'
import VotingCard from '../components/VotingCard'
import AccountDropdown from '../components/AccountDropdown'
import axios from 'axios'
const HomePage = () => {
  const [groups, setGroups] = useState([])
  const [votings, setVotings]= useState([])
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

  const getGroups = async()=>{
    console.log(`${import.meta.env.VITE_BACKEND}/api/group?view=member`)
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/group?view=member`)
    if (response && response.status === 200) {
      setGroups(response.data)
      console.log(response.data)
    }
  } 

   const getVotings = async()=>{
    console.log(`${import.meta.env.VITE_BACKEND}/api/voting?view=admin`)
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/voting?view=admin`)
    if (response && response.status === 200) {
      setVotings(response.data)
      console.log(response.data)
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
                <div  className='squircle flex items-center justify-center rounded-[45px] bg-blue-200 text-blue-800 p-3 border-2 border-blue-800'><User className='size-8'></User></div>
                <div className="flex-1">
                    <h1 className="font-bold text-2xl text-black"><span>Zdravo, </span><span>{profile.name}</span></h1>
                    <p>Ovde cete pronaci vase grupe i glasanja</p>
                </div>
                
            <AccountDropdown></AccountDropdown>
                
            </div>
        </div>
        <div className='w-full flex flex-1'>
        <HalfView title={'Grupe'} icon={<Component className='text-blue-800'></Component>} buttonlink={"/groups"} buttontext={"Sve grupe"}>
        
       {groups.map((item, index)=>{
        return (
          <GroupCard key={item._id} item={item}></GroupCard>
        )
       })}

        </HalfView>
        
        

<div className="bg-[#cecece] h-full w-[1px]"></div>

        <HalfView title={'Glasanja'} icon={<Vote className='text-blue-800'></Vote>} buttonlink={"/votings"} buttontext={"Sva glasanja"}>
        
       {votings
  .filter(item => item.status === "ready") 
  .map((item, index) => (
    <VotingCard item={item} key={item._id} />
  ))
}
  
        </HalfView>



    </div>
    </div>
    
  )
}

export default HomePage