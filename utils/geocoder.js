//we want to bring in geocoder into model

const NodeGeoCoder = require('node-geocoder');
require("dotenv/config");

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;