const mongoose = require('mongoose')
const groupModel = require("../models/GroupModel")
const userModel = require('../models/UserModel')

const getGroups = async(req, res)=>{
    try {
        const view = req.query.view
        if (!view){
            return res.status(400).json({"message": "Prikaz grupa nije naveden"})
        }

        if (view === "all") {
            const items = await groupModel.find()
            return res.status(200).json(items)
        } else if (view === "admin") {
            const items = await groupModel.find({admins: req.user.email})
            return res.status(200).json(items)
        } else if (view === "member") {
            const items = await groupModel.find({members: req.user.email})
            return res.status(200).json(items)
        }
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


const getSingle = async(req, res)=>{
    try {
        const id = req.params.id
        if (!id){
            return res.status(400).json({"message": "ID je obavezan."})
        }

       const items = await groupModel.findById(id)
       const memberemails = items.members
              const adminemails = items.admins

       const memberfull = await userModel.find({email: {$in: memberemails}}).select('-password')
              const adminsfull = await userModel.find({email: {$in: adminemails}}).select('-password')

       return res.status(200).json({"group": items, "members": memberfull, "admins": adminsfull})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}

const createGroup = async(req, res)=>{
    try {
        const ownerid = req.user._id
        const {title, description} = req.body
        console.log(req.user.email)
        const newgroup = new groupModel({owner: ownerid, title, description, members: [], admins: [req.user.email]})
        await newgroup.save()
        return res.status(201).json(newgroup)
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}

const updateGroup = async(req, res)=>{
    try {
        const id = req.params.id
        const updateditem = await groupModel.findByIdAndUpdate(id, {$set: req.body}, {new: true})
        if (!updateditem) {
            return res.status(400).json({"message": "Grupa nije pronađena."})
        }

        return res.status(200).json(updateditem)
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


const deleteGroup = async(req, res)=>{
    try {
        const id = req.params.id
        const deletedItem = await groupModel.findByIdAndDelete(id)
        if (!deletedItem) {
            return res.status(400).json({"message": "grupa nije pronađena."})
        }

        return res.status(200).json({"message": "Grupa uspešno obrisana."})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}

const modifyPeople = async(req, res)=>{
    try {
        const action = req.query.action
        const sector = req.query.sector
        const email = req.query.email
        const id = req.params.id
if (!action || !sector || !email || !id) {
    return res.status(400).json({"message": "Nedostaju neophodni podaci"})
}
        if (sector === "admin") {
            if (action === "remove") {
                const Group = await groupModel.findById(id)
                if (!Group) {
                    return res.status(400).json({"message": "Grupa nije pronađena"})
                } 

                const ownerID = Group.owner
                const ownerDATA = await userModel.findById(ownerID)
                if (!ownerDATA) {
                    return res.status(400).json({"message": "Korisnik nije pronađen"})

                }
                if (ownerDATA.email === email) {
                    return res.status(400).json({"message": "Nije moguće izbaciti vlasnika grupe."})
                }
                const updatedItem = await groupModel.findByIdAndUpdate(id, {$pull: {admins: email}}, {new: true})
                if (!updatedItem) {
                    return res.status(400).json({"message": "Grupa nije pronađena"})
                }

                return res.status(200).json(updatedItem)
            } else if (action === "add") {
                const updatedItem = await groupModel.findByIdAndUpdate(id, {$addToSet: {admins: email}}, {new: true})
                if (!updatedItem) {
                    return res.status(400).json({"message": "Grupa nije pronađena"})
                }

                return res.status(200).json(updatedItem)
            }
        } else if (sector === "member") {
            if (action === "remove") {
                const updatedItem = await groupModel.findByIdAndUpdate(id, {$pull: {members: email}}, {new: true})
                if (!updatedItem) {
                    return res.status(400).json({"message": "Grupa nije pronađena"})
                }

                return res.status(200).json(updatedItem)
            } else if (action === "add") {
                const updatedItem = await groupModel.findByIdAndUpdate(id, {$addToSet: {members: email}}, {new: true})
                if (!updatedItem) {
                    return res.status(400).json({"message": "Grupa nije pronađena"})
                }

                return res.status(200).json(updatedItem)
            }
        }
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


module.exports = {getGroups, createGroup, updateGroup, deleteGroup, modifyPeople, getSingle}