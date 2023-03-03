const express = require('express')
const {getAll,createList, removeFilm, addFilm, getList, removeList, getUserLists, getUserLikes, updateList} = require('../controllers/list.js')
const { cacheData } = require('../middleware/activity.js')
const auth = require('../middleware/middleware.js')
const router = express.Router()



router.get('/', getAll)
router.get('/:id', getList)
router.get('/client/all',auth, getUserLists)
router.post('/create',auth,cacheData, createList)
router.post('/remove',auth,cacheData, removeFilm)
router.post('/add',auth,cacheData, addFilm)
router.post('/edit',auth,cacheData,updateList)

router.delete('/remove/:id',auth,cacheData, removeList)



module.exports = router