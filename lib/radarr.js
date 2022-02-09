const axios = require('axios');
const config = require('../config.json');

//radarr movie add http api
async function addMovie(ctx) {
  return axios.post(`http://192.168.88.88:7878/api/v3/movie/add`,{ 
    body: ctx,
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    config.RADARR_API_KEY,
    }
    }).then(function (response) {
    return response.data;
  }).catch(function (error) {
    console.log(error);
  });
}

//radarr movie lookup http api
async function lookupMovie(name) {
  return axios.get(`${config.RADARR_URL}api/v3/movie/lookup`,{ 
    params: {
      term: name,
    },
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    config.RADARR_API_KEY,
    }
    }).then(function (response) {
    return response.data;
  }).catch(function (error) {
    console.log(error);
  });
}

module.exports = {
  addMovie: addMovie,
  lookupMovie: lookupMovie
};