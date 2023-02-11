const {User,Token} = require('../db/models/models.js')
const {generateSalt,hashPassword,generateToken,checkPassword} = require('../utils/user.js')
const {ServerConnection,Api404Error,BadRequest} = require('../errors/errors.js')
const crypto = require('crypto')
const {client} = require('../db/index.js')
const { Op } = require("sequelize");
const {EMAIL_USER} = require('../config/config.js')
const {sendEmail} = require('../utils/mailer.js')

const getAll =  async (req,res) => {

    let rows = await User.findAll()

    rows.map((x)=> x.dataValues)

    res.send(rows)

}

const signUp = async(req,res) => {
    const { email, password, name, last_name } = req.body;

    try {

        if (!email || !password || !name || !last_name) {

            return res.status(400).json({ message: "Please check the form information" });

        }
        const client = await User.findAll({
            where : {
                email : email
            }
        })

        if (client.length) return res.status(400).json({ message: "User already exists" });

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
        console.log(error)
        throw new ServerConnection
    }

}

const signIn = async (req,res) => {
    const {email,password} = req.body

try {

    if (!email || !password) {

        return res.status(400).json({ message: "Please check the form information" });

    }
    
    const response = await User.findAll({
        where : {
            email : email
        }
    })

    let dataValues = response[0]?.dataValues

    if (!dataValues) return res.status(400).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await checkPassword(password,dataValues.password)

    if (!isPasswordCorrect) return res.status(400).json({ message: "Wrong Password" });

    const token = generateToken(dataValues?.id,dataValues?.email)

    res.send({ dataValues, token })

} catch (error) {

    // throw new ServerConnection
    console.log(error)

}

}

const forgotPassword = async (req,res) => {
    const {email} = req.body
    
    try {

        const [{dataValues}] = await User.findAll({
            where : {
                email : email
            }
        })

        console.log(dataValues, "I find a user")

    
        if (!dataValues) return res.status(400).json({ message: "User doesn't exist" });
    
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

        console.log(resetToken)
    
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

            res.status(400).json({ message: "check mailbox for password reset" })
          
          } catch (error) {
            console.log(error)
          }
          
    } catch (error) {
        // throw new ServerConnection
        console.log(error)
    }

}

const establishNewPassword = async (req,res) => {

    const {password} = req.body
    const {token} = req.params

    try {

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        let [{dataValues}] = await Token.findAll({
            where: {
                token: hashedToken,
                expires_at: {
                    [Op.gt]: Date.now(),
                }
            }
        })

        if (!dataValues) {
            return res.status(400).json({ message: "Invalid Token" });
        }

        const salt = await generateSalt()
        const hashedPassword = await hashPassword(password,salt)

        let updatedUser = await User.update({password:hashedPassword},{
            where: {
                id: dataValues.client_id
            }
        })

        return res.status(200).json({ message: "Password Updated" });


    } catch (error) {
        // throw new ServerConnection
        console.log(error)
    }
}


//check jest test for password recovery. 

module.exports = {
    getAll,signUp,signIn,forgotPassword,establishNewPassword
}