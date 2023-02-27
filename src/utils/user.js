const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const qs = require('qs')
const {APP_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_REDIRECT_URL,GOOGLE_REDIRECT_URL_TEST,GOOGLE_REDIRECT_URL_TEST2} = require('../config/config.js')

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
    return  jwt.sign({id,email},APP_SECRET,{expiresIn:"12hr"})
}

const  getGoogleOAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  
    const options = {
      redirect_uri: GOOGLE_REDIRECT_URL,
      client_id: GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
  
    const query = new URLSearchParams(options);
  
    return `${rootUrl}?${query.toString()}`;
  }


const getGoogleOAuthTokens = async ({code}) => {
    const url = "https://oauth2.googleapis.com/token";
    
    console.log(GOOGLE_REDIRECT_URL_TEST)
    console.log(GOOGLE_CLIENT_SECRET)
    console.log(GOOGLE_CLIENT_ID)
  
    const values = {
      code,
      client_id:GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URL_TEST,
      grant_type: "authorization_code",
    };
  
    try {
      const res = await axios.post(
        url,
        qs.stringify(values),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
  
module.exports = {
    generateSalt,
    hashPassword,
    checkPassword,
    generateToken,
    getGoogleOAuthURL,
    getGoogleOAuthTokens

}