const {User,Token} = require('../db/models/models.js')
const {generateSalt,hashPassword,generateToken,checkPassword,getGoogleOAuthTokens,getGoogleOAuthURL} = require('../utils/user.js')
const {ServerConnection,Api404Error,BadRequest} = require('../errors/errors.js')
const crypto = require('crypto')
const {client} = require('../db/index.js')
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')
const {EMAIL_USER} = require('../config/config.js')
const {sendEmail} = require('../utils/mailer.js')

const getAll =  async (req,res) => {

    // let rows = await User.findAll()

    // rows.map((x)=> x.dataValues)

    // res.send(rows)

    res.json({message:"hola"})

}

const updateUser = async (req,res) => {

    const { email, password, name, last_name } = req.body;

    try {

        if (email || password || name || last_name) {

            const updatedUser =  await User.update({ email,password,name,last_name }, {
                where: {
                  id: 1
                }
            });

            res.send({updatedUser})

        } else {

            throw new BadRequest("Invalid Input")

        }

    } catch (error) {
        
        if (error?.statusCode) {

            res.status(error.statusCode).send({message: error.name})

        } else {

            const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")

            res.status(error.statusCode).send({message: error.name})
        }
    }
}

const signUp = async(req,res) => {
    const { email, password, name, last_name } = req.body;

    try {

        if (!email || !password || !name || !last_name) {

            throw new BadRequest("Invalid Input")

        }
        const client = await User.findAll({
            where : {
                email : email
            }
        })

        if (client.length) throw new BadRequest("User already exists")

        const salt = await generateSalt()
        const hashedPassword = await hashPassword(password,salt)

        const {dataValues} = await User.create({
            name,
            last_name,
            password:hashedPassword,
            email
          }, { fields: ['name','password','last_name','email'] });

          
        const token = generateToken(dataValues.id,dataValues.email)
        

        res.send({ dataValues, token })

        
    } catch (error) {

        if (error?.statusCode) {

            res.status(error.statusCode).send({message: error.name})

        } else {

            const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")

            res.status(error.statusCode).send({message: error.name})
        }
    }

}

const signIn = async (req,res) => {
    const {email,password} = req.body

try {

    if (!email || !password) {

        throw new BadRequest("Invalid Input")

    }
    
    const response = await User.findAll({
        where : {
            email : email
        }
    })

    let dataValues = response[0]?.dataValues

    if (!dataValues) throw new BadRequest("User Doesn't exist")

    const isPasswordCorrect = await checkPassword(password,dataValues.password)

    if (!isPasswordCorrect) throw new BadRequest("Wrong Password")

    const token = generateToken(dataValues?.id,dataValues?.email)

    res.send({ dataValues, token })

} catch (error) {

    if (error?.statusCode) {

        res.status(error.statusCode).send({message: error.name})

    } else {

        const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")

        res.status(error.statusCode).send({message: error.name})
    }

}

}

const forgotPassword = async (req,res) => {
    const {email} = req.body
    
    try {

        const response = await User.findAll({

            where : {
                email : email
            }
        })

        if (!response.length) throw new BadRequest("User Doesn't exist")

        let [{dataValues}] = response
    
        let [token] = await Token.findAll({
            where: {
                client_id : dataValues?.id
            }
        })
    
        if (token?.dataValues?.id) {
            await Token.destroy({
                where : {
                    id : token.dataValues.id
                }
            })
        }
    
        let resetToken = crypto.randomBytes(32).toString("hex")
    
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    
        let clientToken = await Token.create({
            client_id: dataValues?.id,
            token:hashedToken,
            expires_at: Date.now() + 40 * (60 * 1000)
          }, { fields: ['client_id','token','expires_at'] });
        
          const message = `
          <h2>Hello ${dataValues?.name} </h2>
          <p>Please click the link below to reset your passowrd</p>
          <a href=${resetToken} clicktracking=off>${resetToken}</a>
          <h2>Thank you</h2>

          `;

          const subject = "Change Password Request"
          const receiver = dataValues?.email
          const sender = EMAIL_USER

          try {

            await sendEmail(subject,message,receiver,sender)

            res.status(200).json({ message: "check mailbox for password reset" })
          
          } catch (error) {
            console.log(error)
          }
          
    } catch (error) {
        if (error?.statusCode) {

            res.status(error.statusCode).send({message: error.name})
    
        } else {
    
            const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")
    
            res.status(error.statusCode).send({message: error.name})
        }
    }

}

const establishNewPassword = async (req,res) => {

    const {password} = req.body
    const {token} = req.params

    try {

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        let response = await Token.findAll({
            where: {
                token: hashedToken,
                expires_at: {
                    [Op.gt]: Date.now(),
                }
            }
        })

        if (!response.length) {
           throw new BadRequest("Invalid Token")
        }

        const [{dataValues}] = response

        const salt = await generateSalt()
        const hashedPassword = await hashPassword(password,salt)

        let updatedUser = await User.update({password:hashedPassword},{
            where: {
                id: dataValues.client_id
            }
        })

        return res.status(200).json({ message: "Password Updated" });


    } catch (error) {
        if (error?.statusCode) {

            res.status(error.statusCode).send({message: error.name})
    
        } else {
    
            const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")
    
            res.status(error.statusCode).send({message: error.name})
        }
    }
}

const googleRequest = (req,res) => {

   const googleUrl = getGoogleOAuthURL()

    res.send(`<a href=${googleUrl}>Authenticate with Google</a>`);

}

const googleSignIn = async (req,res) => {

 try {

    const code = req.query.code


    const { id_token, access_token } = await getGoogleOAuthTokens({ code });

    const googleUser =  jwt.decode(id_token)

    if (!googleUser.email_verified) {
        return res.status(403).send("Google account is not verified");
    }

    const accessTokenCookieOptions= {
        maxAge: 900000, // 15 mins
        httpOnly: false,
        domain: "localhost",
        path: "/",
        sameSite: "none",
        secure: false,
      };

    console.log(id_token ,"hi")

    res.cookie("accessToken", id_token , accessTokenCookieOptions);
     
    // res.send(`<div>${googleUser.family_name}</div>`);
    res.redirect('http://localhost:3000')
    
 } catch (error) {
    console.log(error)
 }
}


//check jest test for password recovery.
//check unordered client table after update 

module.exports = {
    getAll,signUp,signIn,forgotPassword,establishNewPassword,googleRequest,googleSignIn,updateUser
}