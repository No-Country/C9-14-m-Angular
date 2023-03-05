const {pool} = require ('../db/index.js')
const express= require('express')
const request = require('supertest')
const bodyParser = require('body-parser')
const userRouter = require('../routes/user.js')
const filmRouter = require('../routes/film.js')
const listRouter = require('../routes/list.js')
const likeRouter = require('../routes/like.js')

const reviewRouter = require('../routes/review.js')
const {
  newUser,
  clientExists,
  requestNewPassword,
  updatedClient,
  updatedClient2,
  badupdatedClient,
  clientExistSignin,
  createnonExistList,
  updateExistListRemove,
  updateExistListAdd,
  addExistingfilms,
  cloneList,
  addLikes,
  createEmptyList
} = require('./payload/payload.js')


const app = express()

let server



beforeAll( ()=>{
  server = app.listen(3000)
  app.use(bodyParser.json({limit: "30mb", extended: true}));
  app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
  app.use("/user",userRouter)
  app.use("/film",filmRouter)
  app.use("/review",reviewRouter)
  app.use("/list", listRouter)
  app.use('/like',likeRouter)
})

afterAll((done)=> {
    pool.close()
    server.close()
    done()
})

describe("test boilerplate", ()=>{
    test("get existing user",async ()=> {
       const response = await request(app).get("/user")

       expect(response.body[0].name).toBe("Satoshi")
       expect(response.body[1].name).toBe("Charles")

    })

    test ("get existing film", async ()=> {
      const {body} = await request(app).get('/film')

      expect(body.result[0].title).toBeDefined()
    })

    xtest ('get review from existing film', async()=>{
      const {body} = await request(app).get('/review')

      expect(body[0].comment).toBeDefined()

    })

    test('finds existing user', async()=> {
      const {body} = await request(app).post('/user/signup').send(clientExists)

      console.log(body)

      expect(body).toEqual({message:"User already exists" })
    })

    test("inserts new User", async()=> {
      const {body} = await request(app).post('/user/signup').send(newUser)

      const response = await request(app).get("/user")

      expect(body.dataValues.name).toBe('Ed')
      expect(response.body.length).toEqual(4)
    })

    test("signs in an existing user", async()=> {
      const {body} = await request(app).post('/user/signin').send(newUser)

      expect(body.dataValues.name).toBe('Ed')
      expect(body.token).toBeDefined()
    })

    xtest('receives reset password token and creates  a row in db',async()=>{
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

    it("updates an user", async ()=>{
      const {body} = await request(app).post('/user/update').send(updatedClient2)


      expect(body).toEqual({updatedUser: [1]})
    })

    test("get updated user",async ()=> {
      const {statusCode,body} = await request(app).get("/user")
      expect(body[0].name).toBe("Vitalik")
      expect(body[1].name).toBe("Charles")
      expect(statusCode).toEqual(200)
   })

   it("gets bad request",async ()=> {
     const {body} = await request(app).post('/user/update').send(badupdatedClient)

     expect(body.message).toBe("Invalid Input")
    })

})

xdescribe("test errors without db connected", () => {

  
  xit("receives error because cannot access databse",async ()=> {
    const response = await request(app).get("/user")

    expect(response.body.message).toEqual("Connetion to server failed. Please try again in a few seconds")
    expect(response.statusCode).toEqual(500)
    expect(response.error).toBeDefined()
 })

 xit("cannot updates and gets server error", async ()=>{
      
  const {body} = await request(app).post('/user/update').send(updatedClient2)

  expect(body.message).toEqual("Connetion to server failed. Please try again in a few seconds")
})

xit("cannot sign in and gets server error", async()=> {
  const{body} = await request(app).post('/user/signin').send(clientExistSignin)

  expect(body.message).toEqual("Connetion to server failed. Please try again in a few seconds")
})

})

xdescribe("test list controller", ()=>{
  test("all lists retrieval", async ()=>{
    const {body} = await request(app).get('/list')

    expect(body[0]).toHaveProperty("list_movies")
    expect(body[0].id).toEqual(1)

  })

  test("creates a list", async() => {
    const {body} = await request(app).post('/list/create').send(createnonExistList)

    expect(body.id).toEqual(body.list_movies[0].list_id)
    expect(body.list_movies.length).toEqual(createnonExistList.films.length)

  })

  test("removes 3 films from a list succesfully", async()=> {
    const {body} = await request(app).post('/list/remove').send(updateExistListRemove)
    const response = await request(app).post('/list/remove').send(updateExistListRemove)

    expect(body).toEqual(updateExistListRemove.films.length)
    expect(response.body.message).toEqual("List doesn't have any Series")

  })

  test("adds 3 films to an existing list succesfully", async()=>{
    const existingList = await request(app).get('/list/1')

    //raro que de el length 0

    const {body} = await request(app).post('/list/add').send(updateExistListAdd)
    const response = await request(app).post('/list/add').send(addExistingfilms)
    const checkDuplicates = await request(app).get('/film')
    const updatedexistingList = await request(app).get('/list/1')

    //check that we have added succesfully the movies
    expect(body.length).toEqual(updateExistListAdd.films.length)

    // check that we have created with association
    expect(body[0]).toHaveProperty('film')

    expect(response.body[0]).toHaveProperty('list_id')

    // if the films to be added already exist, we dont create it, but we add the existing one to the list
    expect(checkDuplicates.body.duplicates).toEqual(false)

    //checking that the list has increased its size by the length of the film request to add
    expect(updatedexistingList.body[0].list_movies.length).toEqual(existingList.body[0].list_movies.length + updateExistListAdd.films.length)

  })


  test("all client lists retrieval", async ()=>{
    const {body} = await request(app).get('/list/client/2')
    console.log(body)
    const {cover,id} = body[0]

    expect(body[0]).toHaveProperty("cover")
    expect(id).toEqual(1)
    expect(cover.length).toBeDefined()

  })

  test("clone a list", async() => {
    const {body} = await request(app).post('/list/create').send(cloneList)
    const createdFilms = body.list_movies.map((x)=> x.film_id)
    const requestIds = cloneList.films.map((x)=> x.id)

    expect(body.id).toEqual(body.list_movies[0].list_id)
    expect(body.list_movies.length).toEqual(cloneList.films.length)
    expect(createdFilms).toEqual(requestIds)

  })
  
  test("deletes list succesfully", async()=>{
    const {body} = await request(app).delete('/list/remove/1')
    const nonExistingList = await request(app).get('/list/1')

    expect(body).toEqual(1)

    //check that removed no longer exists in the db

    expect(nonExistingList.body.message).toEqual("Non existing List")

  })

  test("gets a list with all the series information", async()=>{
    const {body} = await request(app).get('/list/2')

    expect(body[0].list_movies).toBeDefined()
    expect(Object.keys(body[0].list_movies[0].film)).toEqual(["id","title","year","poster_path","backdrop_path"])
  
  })

    test("creates an empty list", async() => {
    const {body} = await request(app).post('/list/create').send(createEmptyList)

    expect(body.id).toBeDefined()
    expect(Object.keys(body)).toEqual(["id","description","client_id","created_at","updated_at"])

  })


})


describe("testing like router", ()=>{
  test("retreives all likes", async ()=> {

    const {body} = await request(app).get('/like/client/1')

    expect(body.lists).toBeDefined()
    expect(body.series.length).toBeDefined()

  })

  test("pushes like to serie and responds ok" , async()=>{

    const {body} = await request(app).post('/like').send(addLikes)

    expect(Object.keys(body)).toEqual(['id', 'film_id','client_id','created_at','updated_at'])
    expect(body.client_id).toEqual(addLikes.userId)

  })

})

