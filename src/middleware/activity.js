const redis = require("redis");
const { commandOptions } = require ('redis');


let redisClient
(async () => {
  redisClient = redis.createClient({
    url : 'rediss://red-cg0r20vdvk4ovd2900og:U4dyDgXMpCHveOnZ8vMADf18mrf7aIoW@oregon-redis.render.com:6379'
  });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();

})();


const cacheData = async (req, res, next) => {
  const {userId} = req

  const idstring = 'userid'+userId.toString()
  try {


    const cacheResults = await redisClient.lRange(`${idstring}`,0,100);

    if(cacheResults.length >= 20 ) {
      
      await redisClient.lPop(`${idstring}`);
      await redisClient.lPop(`${idstring}`);


    }

      next();

  } catch (error) {
    console.error(error);
    res.status(404);
  }
}


module.exports = {
    cacheData,
    redisClient
}