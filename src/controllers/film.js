const {Film} = require('../db/models/models.js')

const getAll =  async (req,res) => {

    let rows = await Film.findAll()

    rows = rows.map((x)=> x.dataValues)

    const duplicates = rows
    .map((x)=> x.title+x.year)
    .filter((x,i,arr)=> arr.indexOf(x) !== i)


    res.json({result: rows, duplicates: !duplicates.length ? false : true})

}



module.exports = {
    getAll
}