const express = require('express')
const {getAll} = require("../controllers/user.js")
const router = express.Router()


router.get("/", getAll)

module.exports = router