const newUser = {
    email: "ed@gmail.com",
    password: "nonsense",
    name: "Ed",
    last_name: "Wick"
}

const clientExists = {
    email: "sebafraga0@gmail.com",
    password: "1",
    name: "Satoshi",
    last_name: "Nakamoto"
}

const clientExistSignin = {
  email:  "sebafraga0@gmail.com",
  password: 'bitcoin'
}

const updatedClient = {
  email: "satoshi@bitcoin",
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
    {title: "john wick", year: 2010 },
    {title: "john wick2", year: 2014}
  ]
}

const updateExistListRemove = {

  listId: 1,
  films: [1,2,3]
}

const updateExistListAdd =  {

  listId : 1,
  films: [    
  {title: "batman", year: 2010 },
  {title: "batman 2", year: 2014}
]
}

const addExistingfilms =  {

  listId : 2,
  films: [    
  {title: "batman", year: 2010 },
  {title: "batman 2", year: 2014}
]
}

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
    addExistingfilms
  }