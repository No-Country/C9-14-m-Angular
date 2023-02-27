const express = require ('express')
const { getUserLikes, pushLike } = require('../controllers/like')
const auth = require('../middleware/middleware.js')

const router = express.Router()


router.get('/client',auth, getUserLikes)

router.post('/',auth, pushLike)


module.exports = router
