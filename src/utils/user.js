const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {APP_SECRET} = require('../config/config.js')

const generateSalt = async () => {

  return await bcrypt.genSalt(10)

}

const hashPassword = async (password,salt)=> {

     return await bcrypt.hash(password,salt)

}

const checkPassword =  async (password,savedPassword)=>{

    return await bcrypt.compare(password,savedPassword);

}

const generateToken =  (id,email) => {
    return  jwt.sign({id,email},APP_SECRET,{expiresIn:"1hr"})
}

module.exports = {
    generateSalt,
    hashPassword,
    checkPassword,
    generateToken

}