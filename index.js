const express= require('express')
const bodyParser = require('body-parser')
const userRouter = require('./src/routes/user.js')
const filmRouter = require('./src/routes/film.js')
const reviewRouter = require('./src/routes/review.js')

const app = express()
app.listen(4000,()=>console.log("running on port 4000"))
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use("/user",userRouter)
app.use("/film",filmRouter)
app.use("/review",reviewRouter)