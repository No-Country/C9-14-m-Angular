const express = require ('express')
const { getUserLikes, pushLike } = require('../controllers/like')

const router = express.Router()


router.get('/client/:id', getUserLikes)

router.post('/', pushLike)


module.exports = router


