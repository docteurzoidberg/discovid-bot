require('dotenv').config();

const axios = require('axios');

const RADARR_URL = process.env.RADARR_URL || 'http://localhost:7878/';
const RADARR_API_KEY =  process.env.RADARR_API_KEY || '';

//radarr movie add http api
async function addMovie(ctx) {

  ctx.id= 0;
  ctx.addOptions= { searchForMovie: true };
  ctx.rootFolderPath= "/data/media/movies";
  ctx.qualityProfileId=4;
  ctx.monitored = true;

  return axios.post(`${RADARR_URL}api/v3/movie`, ctx ,{ 
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    RADARR_API_KEY,
    }
    }).then(function (response) {
    return response.data;
  }).catch(function (error) {
    console.error('RADARR addMovie HTTP REQUEST error: ' + error.response.status+ ' ' + error.response.statusText);
  });
}

//radarr movie lookup http api
async function lookupMovie(name) {
  return axios.get(`${RADARR_URL}api/v3/movie/lookup`,{ 
    params: {
      term: name,
    },
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    RADARR_API_KEY,
    }
    }).then(function (response) {
    return response.data;
  }).catch(function (error) {
    console.error('RADARR lookupMovie HTTP REQUEST error: ' + error.response.status+ ' ' + error.response.statusText);
  });
}

//get movie file
async function getMovieFile(id) {
  return axios.get(`${RADARR_URL}api/v3/movieFile`,{ 
    params: {
      movieId: id
    },
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    RADARR_API_KEY,
    }
    }).then(function (response) {
    return response.data;
  }).catch(function (error) {
    if(error.response.status===404) 
      return false;
    console.error('RADARR getMovieFile HTTP REQUEST error: ' + error.response.status+ ' ' + error.response.statusText);
  });
}

async function getProfiles() {
  return axios.get(`${RADARR_URL}api/v3/qualityProfile`,{ 
    params: {
    },
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    RADARR_API_KEY,
    }
    }).then(function (response) {
    return response.data;
  }).catch(function (error) {
    if(error.response.status===404) 
      return false;
    console.error('RADARR getMovieFile HTTP REQUEST error: ' + error.response.status+ ' ' + error.response.statusText);
  });
}

module.exports = {
  addMovie,
  lookupMovie,
  getMovieFile,
  getProfiles
};