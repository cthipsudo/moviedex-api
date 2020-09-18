/* eslint-disable quotes, indent */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIEDATA = require('./movies-data.json');
const cors = require('cors');
const helmet = require('helmet');

//console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    //console.log('validate bearer token middleware');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }
    // move to the next middleware
    next();
});

function handleGetMovies(req, res) {
    let movies = MOVIEDATA;
    let genre = req.query.genre;
    let country = req.query.country;
    let avgVote = req.query.avg_vote;

    if(genre){
        movies = movies.filter( movie => {
            return movie.genre.toLowerCase().includes(genre.toLowerCase());
        });
    }
    if(country){
        movies = movies.filter( movie => {
            return movie.country.toLowerCase().includes(country.toLowerCase());
        });
    }
    if(avgVote){
        movies = movies.filter( movie => {
            return movie.avg_vote >= Number(avgVote);
        });
    }
    res.json(movies);
}

app.get('/movie', handleGetMovies);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});