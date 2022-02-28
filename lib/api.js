require('dotenv').config();
const axios = require('axios');

const apiurl = process.env.API_URL || 'http://localhost:3000/api';

async function addLink(ctx) {
    return axios
    .post(`${apiurl}/links/add`,ctx,{
        headers: {
            "accept":       "application/json",
            "content-type": "application/json"
        }
    })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

async function createAuthLink(ctx) {
    return axios
    .post(`${apiurl}/auth`,ctx,{
        headers: {
            "accept":       "application/json",
            "content-type": "application/json"
        }
    })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

module.exports = {
    addLink, createAuthLink
};