const express = require('express')
const {getAll,signUp,signIn,forgotPassword,establishNewPassword,googleRequest,googleSignIn,updateUser} = require("../controllers/user.js")
const router = express.Router()

router.get("/", getAll)
router.get('/signin/request', googleRequest)
router.get('/signin/oauth',googleSignIn)


router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/forgotpassword", forgotPassword)
router.post("/resetpassword/:token", establishNewPassword)


router.post("/update",updateUser)



module.exports = router