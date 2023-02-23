const express = require('express')
const {getAll} = require("../controllers/film.js")
const router = express.Router()


router.get("/", getAll)

module.exports = router