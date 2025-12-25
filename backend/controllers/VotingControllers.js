const mongoose = require('mongoose')
const VotingModel = require('../models/VotingModel')
const GroupModel = require('../models/GroupModel')
const { getIO } = require('../utils/socket')
const getVotings = async(req,res)=>{
  try {
      const view = req.query.view
    if (!view) {
        return res.status(400).json({"message": "Navedite prikaz podataka."})
    }

    if (view === "all") {
        const items = await VotingModel.find().populate('group')
        return res.status(200).json(items)
    } else if (view === "admin") {
        const adminemail = req.user.email
        if (!adminemail) {
            return res.status(400).json({"message": "Za prikaz glasanja koja Vi administrirate, neophodno je navođenje emaila."})
        }
        const myadmingroups = await GroupModel.find({admins: adminemail}).distinct('_id')
        const myadminvotings = await VotingModel.find({group: {$in: myadmingroups}}).populate('group')

        return res.status(200).json(myadminvotings)
    }
  } catch (error) {
    return res.status(500).json({"error": error.message})
  }

    
}

const getSingleVoting = async(req,res)=>{
  try {
    
const id = req.params.id
        const item = await VotingModel.findOne({_id: id}).populate('owner')
        return res.status(200).json(item)
 
  } catch (error) {
    return res.status(500).json({"error": error.message})
  }

    
}


const getGroupActiveVoting = async(req, res)=>{
    try {
        const groupID = req.params.groupid
        if (!groupID) {
            return res.status(400).json({"message": "Navedite ID grupe"})
        }

        const items = await VotingModel.find({group: groupID}).sort({ createdAt: 1 }).populate('group')
        const activeVotings = items.filter(item => item.status === "running")
        const expiredVotings = items.filter(item => item.status === "archived")
        const upcomingVotings = items.filter(item => item.status === "ready")

        if (items.length === 0) {
            return res.status(200).json({"view": "none"})
        } else{
            if (activeVotings.length > 0) {
                return res.status(200).json({"view": "voting", "data": activeVotings[0]})
            } else {
                if (upcomingVotings.length > 0) {
                    return res.status(200).json({"view": "upcoming", "data": upcomingVotings[0]})
                } else if (expiredVotings.length > 0) {
                    return res.status(200).json({"view": "expired", "data": expiredVotings[expiredVotings.length - 1]})
                }
            }
        }
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}

const createVoting = async(req, res)=>{
    try {
        const {title, description, group, expiration} = req.body
        if (!title || !description || !group || !expiration) {
            return res.status(400).json({"message": "Neophodan je unos naziva, opisa, grupe i isteka glasanja."})
        }
    const owner = req.user._id
    const voted = []
    const options = []
    const status = "ready"

    const newItem = new VotingModel({owner, title, description, group, options, voted, status, expiration})
    await newItem.save()
    return res.status(201).json(newItem)
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}

const updateVoting = async(req, res)=>{
    try {
        const id = req.params.id
        const body = req.body

        if (!id || !body) {
            return res.status(400).json({"message": "Validacija neuspešna."})
        }

        const updatedItem = await VotingModel.findByIdAndUpdate(id, body, {new: true})

        if (!updatedItem) {
            return res.status(400).json({"message": "Glasanje nije pronađeno"})
        }

        return res.status(200).json(updatedItem)
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


const deleteVoting = async(req, res)=>{
    try {
        const id = req.params.id

        const deletedItem = await VotingModel.findByIdAndDelete(id)
        if (!deletedItem) {
            return res.status(400).json({"message": "Glasanje nije pronađeno."})
        }

        return res.status(200).json({"message": "Uspešno brisanje"})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


const editOptions = async(req, res)=>{
    try {
        const VotingID = req.params.id
        
        const action = req.query.action

        if (!VotingID || !action) {
            return res.status(400).json({"message": "Nedostaje ID glasanja, željena opcija ili akcija"})
        }

        if (action === "add") {
            const option = req.query.title
            if (!option) {
                return res.status(400).json({"message": "Neophodan unos naziva opcije"})
            }
            const newitem = await VotingModel.findByIdAndUpdate(VotingID, {
                $addToSet: {
                    options: {
                        text: option,
                        votes: 0
                    }
                }
            },
        {new: true})


        return res.status(200).json(newitem)
        } else if (action === "remove") {
            const optionID = req.query.optionID
            if (!optionID) {
                return res.status(400).json({"message": "Neophodan unos ID-a opcije"})
            }
             const newItem = await VotingModel.findByIdAndUpdate(VotingID, {
                $pull: {
                    options: {
                        _id: optionID
                    }

                }
            },
        {new: true})

        return res.status(200).json(newItem)


        }
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


const IncrementVotes = async(req, res)=>{
    try {
        const VotingID = req.params.id
                const optionID = req.query.optionID
                const email = req.user.email

        


        if (!VotingID || !optionID) {
            return res.status(400).json({"message": "Nedostaje ID glasanja ili ID opcije."})
        }

    const voting = await VotingModel.findById(VotingID)
    if (!voting) {
      return res.status(404).json({ message: "Glasanje nije pronađeno." })
    }

    if (voting.voted.includes(email)) {
      return res.status(400).json({ message: "Već ste glasali." })
    }        

        const updatedItem= await VotingModel.findByIdAndUpdate(VotingID, {
            $inc: {
                "options.$[opt].votes": 1
            },

            $addToSet: {
                voted: email
            }
        }, {new: true,
            arrayFilters: [{ "opt._id": optionID }]
        })


        if (!updatedItem) {
            return res.status(400).json({"message": "Nije pronađeno glasanje."})
        }
const io = getIO()
        io.to(VotingID).emit("receiveSignal", {
        "type": "updateStats",
        "optionid": optionID
    })
        return res.status(200).json(updatedItem)

    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}


module.exports = {getVotings, getGroupActiveVoting, createVoting, updateVoting, deleteVoting, editOptions, IncrementVotes, getSingleVoting}