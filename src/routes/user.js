const express = require('express')
const {getAll,signUp,signIn} = require("../controllers/user.js")
const router = express.Router()


router.get("/", getAll)
router.post("/signup", signUp)
router.post("/signin", signIn)

module.exports = router