const {User} = require('../db/models/user.js')
const {generateSalt,hashPassword,generateToken,checkPassword} = require('../utils/user.js')
const {ServerConnection,Api404Error,BadRequest} = require('../errors/errors.js')

const getAll =  async (req,res) => {

    let rows = await User.findAll()

    rows.map((x)=> x.dataValues)

    res.send(rows)

}

const signUp = async(req,res) => {
    const { email, password, name, last_name } = req.body;

    try {
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
        throw new ServerConnection
    }

}

const signIn = async (req,res) => {
    const {email,password} = req.body

try {
    
    const [{dataValues}] = await User.findAll({
        where : {
            email : email
        }
    })

    if (!dataValues) return res.status(400).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await checkPassword(password,dataValues.password)

    if (!isPasswordCorrect) return res.status(400).json({ message: "Wrong Password" });

    const token = generateToken(dataValues.id,dataValues.email)

    res.send({ dataValues, token })

} catch (error) {

    throw new ServerConnection

}

}


module.exports = {
    getAll,signUp,signIn
}