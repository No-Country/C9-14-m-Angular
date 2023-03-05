const newUser = {
    email: "ed@gmail.com",
    password: "nonsense",
    name: "Ed",
    last_name: "Wick"
}

const clientExists = {
    email: "angular14m@gmail.com",
    password: "Angular14%",
    name: "Satoshi",
    last_name: "Nakamoto"
}

const clientExistSignin = {
  email:  "angular14m@gmail.com",
  password: 'Angular14%'
}

const updatedClient = {
  email: "angular14m@gmail.com",
  password: "eth",
}

const updatedClient2 = {
  name: "Vitalik",
  last_name: "Buterin",
}
const badupdatedClient = {
  names: "Vitalik",
  last_names: "Buterin",
}

const requestNewPassword = {
  email: "mgabiscarfo@gmail.com"
}

const createnonExistList = {

  userId: 3,
  description: "I like action",
  films: [
    {id: 25, title: "john wick", year: 2010,poster_path: "hola1", backdrop_path: "chau" },
    {id: 26, title: "john wick2", year: 2014,poster_path: "hola2", backdrop_path: "chau" },    
  ]
}

const createEmptyList = {
  
  userId: 3,
  description: "I like action",
  
}

const cloneList = {
  userId : 3,
  description: "my fav",
  films : [
    {id: 1},{id:2},{id:3}
  ]
}

const updateExistListRemove = {

  listId: 1,
  films: [1,2,3,4]
}

const updateExistListAdd =  {

  listId : 1,
  films: [    
  {id: 100, title: "batman", year: 2010 },
  {id: 101, title: "batman 2", year: 2014}
]
}

const addExistingfilms =  {

  listId : 2,
  films: [    
  {id: 100,title: "batman", year: 2010 },
  {id: 100,title: "batman 2", year: 2014}
]
}

const addLikes = {

  userId: 3,
  film : {
    title: 'Pretty Little Liars',
    year: '2010'
  }

}

const sampleList = [
  {
    id: 1,
    list_movies: [
      {
        id : 2,
        poster_path: "hola",
        backdrop_path: "chau"
      },
      {
        id : 3,
        poster_path: "hola2",
        backdrop_path: "chau2"
      }
    ]
  }
]

  module.exports = {
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
    sampleList,
    createEmptyList
  }