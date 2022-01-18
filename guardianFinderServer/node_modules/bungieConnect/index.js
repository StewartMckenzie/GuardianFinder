//require axios for XMLHttpRequests
const axios = require('axios');

//require config with out api key and base url
const config = require('./config.json');

//Create an object for the configuration of our XMLHttpRequests being sent with axios
const requestConfig = {
  method: 'get',
  url: '',
  headers: {
    'X-API-KEY': config.XAPIKEY,
  },
};

// Helper function that actually does the request
const axiosRequest = async (requestConfig) => {
  //Do an XMLHttpRequest using axios and the passed in specifications returning the response
  return await axios(requestConfig)
    .then((raw) => {
      return raw.data.Response;
    })
    .catch((error) => {
      console.log(
        'There has been an error with the API. Please run the app again!',
      );
    });
};

//searches for players based on a query string returns an object with a display name and membership id
const requestPlayers = async (queryString, platform) => {
  const userUrl = `${config.url}/SearchDestinyPlayer/${platform}/${queryString}`;
  //update the config object to the correct url
  requestConfig['url'] = userUrl;
  return axiosRequest(requestConfig);
};

//returns a players profile containing all destiny 1 characters useing membership id and platform
const requestProfile = async (membershipId, platform) => {
  const profileUrl = `${config.url}/${platform}/Account/${membershipId}/Character/0/Stats/`;
  //update the config object to the correct url
  requestConfig['url'] = profileUrl;
  return axiosRequest(requestConfig);
};

module.exports = {
  requestPlayers,
  requestProfile,
};
