// ------------------------------------------------------------- Require modules
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const config = require('./webpack.config');
const express = require('express');
const request = require('request');

// -------------------------------------------------------- Setup main variables
const app = express();
const port = '3000';

const numberOfUsers = 20;
const path = require('path');
const apiPath = `https://randomuser.me/api/?results=${numberOfUsers}&nat=au`;
const publicPath = path.join(__dirname, '/dist');
// Setup middleware
app.use(webpackDevMiddleware(webpack(config)));
// ---------------------------------------------------------------------- Routes
// Setup static file routes
app.use(express.static(`${__dirname}/dist`));

// Setup API call for generating random people
app.route('/api/v1/people')
    .get((req, res) => {
        // Load the users...
        request(apiPath, (err, response, body) => {
            // Map the needed data
            const users = JSON.parse(body).results.map(user => ({
                name: user.name,
                profile: user.picture.medium
            }));
            // Then return them
            res.json(users);
        });
    });


app.listen(port, () => {
    console.log(`server on port ${port}`);
});
