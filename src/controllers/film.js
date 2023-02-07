const {Film} = require('../db/models/models.js')

const getAll =  async (req,res) => {

    let rows = await Film.findAll()

    rows.map((x)=> x.dataValues)

    res.send(rows)

}


module.exports = {
    getAll
}