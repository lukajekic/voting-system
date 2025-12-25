const express = require('express')
const UserController = require('../controllers/UserControllers')
const protect = require('../middleware/APIProtect')
const router = express.Router()
const path = require('path')
const crypto = require('crypto')

const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, path.join(__dirname, '../uploads'))
    },

    filename: (req, file, callback) =>{
        callback(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})





router.get('/', protect, UserController.getUsers)
router.get('/confirm/:email', protect, UserController.getConfimationInfo)

router.get('/me', protect, UserController.getUserInfo)
router.post('/login', UserController.Login)
router.post('/logout', UserController.Logout)
router.post('/register', upload.single('profileimage'), UserController.Register)
const fs = require('fs')
router.get('/avatar/:filename',protect, (req,res)=>{
    const filepath = path.join(__dirname,  `../uploads/${req.params.filename}`)
    const avatarbasicpath = path.join(__dirname,  `../uploads/avatarbasic.png`)

    if (fs.existsSync(filepath)) {
        res.sendFile(filepath)
    } else {
        res.sendFile(avatarbasicpath)
    }
})
module.exports = router