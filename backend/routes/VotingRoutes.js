const express = require('express')
const VotingControllers = require('../controllers/VotingControllers')
const protect = require('../middleware/APIProtect')
const router = express.Router()

router.get('/', protect, VotingControllers.getVotings)
router.get('/:id', protect, VotingControllers.getSingleVoting)

router.get('/group/:groupid', protect, VotingControllers.getGroupActiveVoting)
router.post('/', protect, VotingControllers.createVoting)
router.put('/:id', protect, VotingControllers.updateVoting)
router.delete('/:id', protect, VotingControllers.deleteVoting)
router.put('/options/:id', protect, VotingControllers.editOptions)
router.put('/vote/:id', protect, VotingControllers.IncrementVotes)

module.exports = router