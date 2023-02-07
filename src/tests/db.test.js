const {pool} = require ('../db/index.js')
const express= require('express')
const request = require('supertest')
const userRouter = require('../routes/user.js')
const filmRouter = require('../routes/film.js')
const reviewRouter = require('../routes/review.js')


const app = express()

let server

beforeAll( ()=>{
  server = app.listen(3000)
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
    xtest("receives Satoshi",async ()=> {
       const response = await request(app).get("/user")

       expect(response.body[0].name).toBe("Satoshi")
       expect(response.body[1].name).toBe("Charles")

    })

    xtest ("receives guardian", async ()=> {
      const {body} = await request(app).get('/film')

      expect(body[0].title).toBe('guardian')
    })

    xtest ('receives Amazing Movie', async()=>{
      const {body} = await request(app).get('/review')

      expect(body[0].comment).toBe('Amazing Movie')

    })
})

