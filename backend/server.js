const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const cookieparser = require('cookie-parser')
console.log(process.env.FRONTEND_URL)
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const connectDB = require('./utils/db')

const http = require('http')
const server = http.createServer(app)

const userRouter = require('./routes/UserRoutes')
app.use('/api/user', userRouter)
const groupRouter = require('./routes/GroupRoutes')
app.use('/api/group', groupRouter)
const votingRouter = require('./routes/VotingRoutes')
const { InitiateSocket } = require('./utils/socket')
app.use('/api/voting', votingRouter)

const socketroutes = require('./routes/SocketRoutes')
app.use('/api/socket', socketroutes)


InitiateSocket(server)


connectDB().then(()=>{
    server.listen(3000)
    console.log('sevrer running on port 3000')
})

