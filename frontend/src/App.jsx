import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Groups from './pages/Groups'
import VotingCard from './components/VotingCard'
import Votings from './pages/Votings'
import Login from './pages/Login'
import Register from './pages/Register'
import EditGroup from './pages/EditGroup'
import EditVoting from './pages/EditVoting'
import GroupMember from './pages/GroupMember'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
<BrowserRouter>
<ToastContainer></ToastContainer>
<Routes>

<Route path='/' element={<HomePage></HomePage>}></Route>
<Route path='/groups' element={<Groups></Groups>}></Route>
<Route path='/votings' element={<Votings></Votings>}></Route>
<Route path='/login' element={<Login></Login>}></Route>
<Route path='/register' element={<Register></Register>}></Route>
<Route path='/group/:id' element={<EditGroup></EditGroup>}></Route>
<Route path='/voting/:id' element={<EditVoting></EditVoting>}></Route>
<Route path='/member/group/:id' element={<GroupMember></GroupMember>}></Route>

</Routes>

</BrowserRouter>
  )
}

export default App
