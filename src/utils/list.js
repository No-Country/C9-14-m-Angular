const _ = require('lodash');

const addRandomCover = (list)=>{

    

   const allPosters=  list.list_movies.map((x)=> {
    const filmData= x.dataValues.film.dataValues
   return [filmData.poster_path, filmData.backdrop_path]
   })

   if (allPosters.length > 4 ) {
    return randomPosters = _.sampleSize(allPosters, 4);
   }
   
   return allPosters

}

module.exports = {
    addRandomCover
}