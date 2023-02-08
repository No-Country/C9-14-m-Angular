const express = require('express')
const {getAll,signUp,signIn,forgotPassword,establishNewPassword} = require("../controllers/user.js")
const router = express.Router()

router.get("/", getAll)
router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/forgotpassword", forgotPassword)
router.post("/resetpassword/:token", establishNewPassword)

module.exports = router