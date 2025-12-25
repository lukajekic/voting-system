 const {getIO} = require("../utils/socket") 
 const express = require('express')
 const router = express.Router()


 router.post("/sendsignal", (req,res)=>{
    const {votingID, signal} = req.body

    try {
        const io = getIO()
        io.to(votingID).emit("receiveSignal", signal)
        return res.status(200).json({"message": "Signal poslat"})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
 })

 module.exports = router