const express= require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const userRouter = require('./src/routes/user.js')
const filmRouter = require('./src/routes/film.js')
const reviewRouter = require('./src/routes/review.js')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

const app = express()
app.listen(4000,()=>console.log("running on port 4000"))
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use("/user",userRouter)
app.use("/film",filmRouter)
app.use("/review",reviewRouter)
