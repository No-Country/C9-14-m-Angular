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

  module.exports = {
    newUser,clientExists,requestNewPassword,updatedClient,updatedClient2,badupdatedClient,clientExistSignin
  }