const newUser = {
    email: "ed@gmail.com",
    password: "nonsense",
    name: "Ed",
    last_name: "Wick"
}

const clientExists = {
    email: "satoshi@bitcoin",
    password: "1",
    name: "Satoshi",
    last_name: "Nakamoto"
  }

const updatedClient = {
  email: "satoshi@bitcoin",
  password: "eth",
}

const requestNewPassword = {
  email: "mgabiscarfo@gmail.com"
}

  module.exports = {
    newUser,clientExists,requestNewPassword,updatedClient
  }