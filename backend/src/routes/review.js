const express = require('express')
const {getReview} = require("../controllers/review.js")
const router = express.Router()


router.get("/", getReview)

module.exports = router