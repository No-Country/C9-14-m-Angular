const express = require('express')
const { getActivity } = require('../controllers/activity')
const { cacheData } = require('../middleware/activity')
const auth = require('../middleware/middleware')
const router = express.Router()


router.get('/',auth,cacheData,getActivity)

module.exports = router
