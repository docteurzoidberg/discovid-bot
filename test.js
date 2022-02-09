
// Language: javascript
// Path: bdv-bot/test.js

const axios = require('axios');

//function that consume radarr http api
async function searchMovie(name) {
  return axios.get(`http://192.168.88.88:7878/api/v3/movie/lookup`,{ 
    params: {
      term: name,
    },
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    "0bd00a736bf94ab699cfc2b6c764d2c7",
    }
    }).then(function (response) {
    return response.data;
  }).catch(function (error) {
    console.log(error);
  });
}

searchMovie('les bronzes').then(function (response) {
  console.log(response[0]);
});