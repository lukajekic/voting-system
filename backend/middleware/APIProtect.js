const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const userModel = require('../models/UserModel')



const protect = asyncHandler(async(req,res, next)=>{
    let token = req.cookies.token

    if (!token){
        return res.status(401).json({"message": "Niste prijavljen, token nije prisutan."})
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded) {
            const user = await userModel.findById(decoded.id)
            req.user = user
            req.user.id = user._id
            next()
        }
        } catch (error) {
        return res.status(401).json({"message": "Niste prijavljen, token nije važeći."})
        }
    }
})

module.exports = protect