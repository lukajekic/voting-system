const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const userModel = require('../models/UserModel')
const multer = require('multer')

const getUsers = async(req, res)=>{
    try {
        let filters  ={}
        const email = req.query.email
        if (email) {
            filters.email = email
        }

        const users = await userModel.find(filters)
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}

const getUserInfo = async(req, res)=>{
    try {
        const userid = req.user._id
        console.log(req.user)
        const user = await userModel.findById(userid)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}

const getConfimationInfo = async(req, res)=>{
    try {
        const userid = req.params.email
        const user = await userModel.findOne({email: userid})
         if (!user) {
            return res.status(400).json({"message": "Korisnik nije pronađen."})
        }
        return res.status(200).json(user)
       
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


const Login = async(req,res)=>{
    try {
        const {email, password} = req.body

        const user = await userModel.findOne({email})

        if (!user) {
            return res.status(400).json({"message": "Netačni podaci za prijavu."})
        }

        const passwordOK = await bcrypt.compare(password, user.password)

        if (!passwordOK) {
            return res.status(400).json({"message": "Netačni podaci za prijavu."})
        }

        res.cookie('token', GENERATEJWT(user._id), {
            maxAge: 86400000,
            secure: true,
            httpOnly: true,
            sameSite: 'none'
        })

        return res.status(200).json({message: "Uspešna prijava.", user: {id: user._id, name: user.name, email: user.email}})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}



const Register = async(req,res)=>{
    try {
        const {email, password, name} = req.body
const filename = req.file?.filename || "avatarbasic.png"
const salt = await bcrypt.genSalt(10)
const encrypted = await bcrypt.hash(password, salt)
        const newuser = new userModel({email, password: encrypted, name, profilepicture: filename})
        await newuser.save()

       

            res.cookie('token', GENERATEJWT(newuser._id), {
                maxAge: 86400000,
                secure: true,
                httpOnly: true,
                sameSite: 'none'
            })

            return res.status(201).json({message: "Uspešna registracija.", user: {id: newuser._id, name: newuser.name, email: newuser.email}})
        
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


const Logout = async(req, res)=>{
    res.cookie('token', '', {
        expires: new Date(0),
        secure: true,
        httpOnly: true,
        sameSite: "none"
    })

    return res.status(200).json({"message": "Uspešna odjava."})
}

function GENERATEJWT(string) {
    return jwt.sign({id: string}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

module.exports = {
  getUsers,
  getUserInfo,
  Login,
  Register,
  Logout,
  getConfimationInfo
}

