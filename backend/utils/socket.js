let io = null

const InitiateSocket = (server) =>{
    
    io = require('socket.io')(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    })
    io.on("connection", (socket)=>{
console.log("SOCKET POVEZAN:", socket.id)


socket.on("joinVoting", (votingID) =>{
    socket.join(votingID)
    console.log(`${socket.id} pristupio je sobi glasanja ${votingID}`)
})


    })
}

const getIO = ()=>{
    if (!io) {
        console.log("SOCKET NIJE INICIJALIZOVAN")
    }
return io

}

module.exports = {InitiateSocket, getIO}