const {User} = require('../db/models/user.js')

const getAll =  async (req,res) => {

    let rows = await User.findAll()

    rows.map((x)=> x.dataValues)

    res.send(rows)

}


module.exports = {
    getAll
}