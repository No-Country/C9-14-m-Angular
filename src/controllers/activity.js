const redis = require("redis");
const { redisClient } = require('../middleware/activity');

const getActivity = async(req,res)=>{

    const {userId} = req
    const idstring = 'userid'+userId.toString()


    try {
        const cacheResults = await redisClient.lRange(`${idstring}`,0,100);

        const outputArray = cacheResults.reduce((acc, curr, i) => {
            if (i % 2 === 0) {
              acc.push({ title: curr, date: cacheResults[i + 1] });
            }
            return acc;
          }, []);

        res.send(outputArray)
        
    } catch (error) {
        console.log(error)
    }

}

module.exports= {
    getActivity
}