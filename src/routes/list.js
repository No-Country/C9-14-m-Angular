const express = require('express')
const {getAll,createList, removeFilm, addFilm, getList, removeList} = require('../controllers/list.js')
const router = express.Router()



router.get('/', getAll)
router.get('/:id', getList)

router.post('/create', createList)
router.post('/remove', removeFilm)
router.post('/add', addFilm)

router.delete('/remove/:id', removeList)



module.exports = router