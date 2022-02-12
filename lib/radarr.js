const axios = require('axios');
const config = require('../config.json');

var addSample = {
  title: "Les Aventures de Tintin : Le Secret de la Licorne",
  originalTitle: "The Adventures of Tintin",
  alternateTitles: [
    {
      sourceType: "tmdb",
      movieId: 0,
      title: "The Adventures of Tintin 3D",
      sourceId: 0,
      votes: 0,
      voteCount: 0,
      language: { id: 1, name: "English" },
    },
    {
      sourceType: "tmdb",
      movieId: 0,
      title: "The Adventures of Tintin: The Secret of the Unicorn",
      sourceId: 0,
      votes: 0,
      voteCount: 0,
      language: { id: 1, name: "English" },
    },
    {
      sourceType: "tmdb",
      movieId: 0,
      title: "As Aventuras de Tintim - O Segredo do Licorne",
      sourceId: 0,
      votes: 0,
      voteCount: 0,
      language: { id: 18, name: "Portuguese" },
    },
    {
      sourceType: "tmdb",
      movieId: 0,
      title: "Les Aventures de Tintin - Le Secret de la Licorne",
      sourceId: 0,
      votes: 0,
      voteCount: 0,
      language: { id: 2, name: "French" },
    },
    {
      sourceType: "tmdb",
      movieId: 0,
      title: "Tim und Struppi und das Geheimnis der Einhorn",
      sourceId: 0,
      votes: 0,
      voteCount: 0,
      language: { id: 4, name: "German" },
    },
    {
      sourceType: "tmdb",
      movieId: 0,
      title: "Οι Περιπέτειες του Τεντέν: Το Μυστικό του Μονόκερου",
      sourceId: 0,
      votes: 0,
      voteCount: 0,
      language: { id: 1, name: "English" },
    },
  ],
  secondaryYearSourceId: 0,
  sortTitle: "les aventures de tintin le secret de la licorne",
  sizeOnDisk: 0,
  status: "released",
  overview:
    "Tintin, notre intrépide reporter, son fidèle compagnon Milou et son inséparable ami le capitaine Haddock partent à la recherche d’un trésor enfoui avec l’épave d’un bateau « la Licorne », commandé autrefois par un ancêtre du capitaine Haddock.",
  inCinemas: "2011-10-24T00:00:00Z",
  physicalRelease: "2012-02-27T00:00:00Z",
  digitalRelease: "2013-08-29T00:00:00Z",
  images: [
    {
      coverType: "poster",
      url: "/MediaCoverProxy/6e5cee1aae4390690dbe15d26b9e35319f1b225611d6bfb303b8515a97a7e485/mKYkNro2btaWMsnYSuyqrBdHQo3.jpg",
      remoteUrl:
        "https://image.tmdb.org/t/p/original/mKYkNro2btaWMsnYSuyqrBdHQo3.jpg",
    },
    {
      coverType: "fanart",
      url: "/MediaCoverProxy/1b217ea0bba0e87d6fc7527065dd528620f3d3955b4d0d47b7972a020d5f98b1/5parN40mSwZMCP4Ig11lE6keeFi.jpg",
      remoteUrl:
        "https://image.tmdb.org/t/p/original/5parN40mSwZMCP4Ig11lE6keeFi.jpg",
    },
  ],
  website: "",
  remotePoster:
    "https://image.tmdb.org/t/p/original/mKYkNro2btaWMsnYSuyqrBdHQo3.jpg",
  year: 2011,
  hasFile: false,
  youTubeTrailerId: "7NWtW699XME",
  studio: "Paramount",
  qualityProfileId: 1,
  monitored: true,
  minimumAvailability: "announced",
  isAvailable: true,
  folderName: "",
  runtime: 107,
  cleanTitle: "theadventurestintin",
  imdbId: "tt0983193",
  tmdbId: 17578,
  titleSlug: "17578",
  folder: "The Adventures of Tintin (2011)",
  certification: "U",
  genres: ["Adventure", "Animation", "Mystery"],
  tags: [],
  added: "0001-01-01T00:00:00Z",
  ratings: { votes: 4455, value: 6.8 },
  id: 0,
  addOptions: { searchForMovie: true },
  rootFolderPath: "/movies",
};

//radarr movie add http api
async function addMovie(ctx) {

  ctx.id= 0;
  ctx.addOptions= { searchForMovie: true };
  ctx.rootFolderPath= "/movies";
  ctx.qualityProfileId=4;
  ctx.monitored = true;

  return axios.post(`${config.RADARR_URL}api/v3/movie`, ctx ,{ 
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    config.RADARR_API_KEY,
    }
    }).then(function (response) {
    return response.data;
  }).catch(function (error) {
    console.error('RADARR addMovie HTTP REQUEST error: ' + error.response.status+ ' ' + error.response.statusText);
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
    console.error('RADARR lookupMovie HTTP REQUEST error: ' + error.response.status+ ' ' + error.response.statusText);
  });
}

//get movie file
async function getMovieFile(id) {
  return axios.get(`${config.RADARR_URL}api/v3/movieFile`,{ 
    params: {
      movieId: id
    },
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    config.RADARR_API_KEY,
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
  return axios.get(`${config.RADARR_URL}api/v3/qualityProfile`,{ 
    params: {
    },
    headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "x-api-key":    config.RADARR_API_KEY,
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