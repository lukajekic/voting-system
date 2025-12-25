const express = require('express')
const groupsModel = require('../controllers/GroupControllers')
const router = express.Router()
const protect = require('../middleware/APIProtect')

router.get('/', protect, groupsModel.getGroups)

router.get('/:id', protect, groupsModel.getSingle)
router.post('/', protect, groupsModel.createGroup)
router.put('/:id', protect, groupsModel.updateGroup)
router.delete('/:id', protect, groupsModel.deleteGroup)
router.put('/people/:id', protect, groupsModel.modifyPeople)

module.exports = router