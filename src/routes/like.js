const express = require ('express')
const { getUserLikes, pushLike, removeLike } = require('../controllers/like')
const { cacheData } = require('../middleware/activity')
const auth = require('../middleware/middleware.js')

const router = express.Router()


router.get('/client',auth, getUserLikes)

router.post('/',auth,cacheData, pushLike)

router.post('/remove',auth,cacheData, removeLike )


module.exports = router
