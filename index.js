const express= require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const userRouter = require('./src/routes/user.js')
const filmRouter = require('./src/routes/film.js')
const reviewRouter = require('./src/routes/review.js')
const listRouter = require('./src/routes/list.js')
const likeRouter = require('./src/routes/like.js')
const activityRouter = require('./src/routes/activity.js')






const app = express()
app.listen(4000,()=>console.log("running on port 4000"))
app.use(cors());
app.use(cookieParser())
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use("/user",userRouter)
app.use("/film",filmRouter)
app.use("/review",reviewRouter)
app.use("/list", listRouter)
app.use("/like",likeRouter)
app.use('/activity',activityRouter)
