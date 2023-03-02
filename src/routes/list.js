const express = require('express')
const {getAll,createList, removeFilm, addFilm, getList, removeList, getUserLists, getUserLikes, updateList} = require('../controllers/list.js')
const auth = require('../middleware/middleware.js')
const router = express.Router()



router.get('/', getAll)
router.get('/:id', getList)
router.get('/client/all',auth, getUserLists)

router.post('/create',auth, createList)
router.post('/remove', removeFilm)
router.post('/add', addFilm)
router.post('/edit',auth,updateList)

router.delete('/remove/:id', removeList)



module.exports = router