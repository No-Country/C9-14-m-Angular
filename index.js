const express= require('express')
const http = require('http')
const bodyParser = require('body-parser')
const userRouter = require('./src/routes/user.js')
const filmRouter = require('./src/routes/film.js')
const reviewRouter = require('./src/routes/review.js')

const app = express()

const server = http.createServer(app)

server.listen(4000,()=>console.log("running on port 4000"))
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use("/user",userRouter)
app.use("/film",filmRouter)
app.use("/review",reviewRouter)
app.get("/test",(req,res)=>{
        console.log("testing route")
    return res.json({message : "test route"})
} )