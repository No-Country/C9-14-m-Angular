const {Review} = require('../db/models/models.js')

const getReview =  async (req,res) => {

    //modificar aca para retraer con client id y film id

    let rows = await Review.findAll()

    rows.map((x)=> x.dataValues)

    res.send(rows)

}

module.exports = {
    getReview
}