const {pool} = require ('../db/index.js')
const express= require('express')
const request = require('supertest')
const bodyParser = require('body-parser')
const userRouter = require('../routes/user.js')
const filmRouter = require('../routes/film.js')
const reviewRouter = require('../routes/review.js')
const {newUser,clientExists,requestNewPassword,updatedClient} = require('./payload/payload.js')


const app = express()

let server



beforeAll( ()=>{
  server = app.listen(3000)
  app.use(bodyParser.json({limit: "30mb", extended: true}));
  app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
  app.use("/user",userRouter)
  app.use("/film",filmRouter)
  app.use("/review",reviewRouter)
})

afterAll((done)=> {
    pool.close()
    server.close()
    done()
})

describe("test boilerplate", ()=>{
    xtest("get existing user",async ()=> {
       const response = await request(app).get("/user")

       expect(response.body[0].name).toBe("Satoshi")
       expect(response.body[1].name).toBe("Charles")

    })

    xtest ("get existing film", async ()=> {
      const {body} = await request(app).get('/film')

      expect(body[0].title).toBe('guardian')
    })

    xtest ('get review from existing film', async()=>{
      const {body} = await request(app).get('/review')

      expect(body[0].comment).toBe('Amazing Movie')

    })

    xtest('finds existing user', async()=> {
      const {body} = await request(app).post('/user/signup').send(clientExists)

      expect(body).toEqual({message:"User already exists" })
    })

    xtest("inserts new User", async()=> {
      const {body} = await request(app).post('/user/signup').send(newUser)

      const response = await request(app).get("/user")

      expect(body.dataValues.name).toBe('Ed')
      expect(response.body.length).toEqual(4)
    })

    xtest("signs in an existing user", async()=> {
      const {body} = await request(app).post('/user/signin').send(newUser)

      expect(body.dataValues.name).toBe('Ed')
      expect(body.token).toBeDefined()
    })

    test('receives reset password token and creates  a row in db',async()=>{
      const {body} = await request(app).post('/user/forgotpassword').send(requestNewPassword)
      
      expect(body.token).toBeDefined()

    })

    xtest('resets password with the reset password token', async()=> {
      const {body} = await request(app).post('/user/resetpassword/8bb4275ea8676e2cc4cc093a49f498ecea082409041cb598bf2b61404fcdd732').send({password: "eth"})

      expect(body).toEqual([1])
    })

    xtest('signs in with updated credentials', async ()=> {
      const {body} = await request(app).post('/user/signin').send(updatedClient)

      console.log(body)

    })



})

