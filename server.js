const express = require('express');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const envResult = require('dotenv').config();
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, prettyPrint} = format;
const axios = require('axios');
const CONFIGS = process.env.ENV === 'prod' ?
    require('./configs/production') :
    process.env.ENV === 'dev' ?
        require('./configs/development') :
        require('./configs/default');

/**
 * Logger Setting
 * */
const logger = createLogger({
    format: combine(
        // label({label:'label test'}),
        timestamp(),
        prettyPrint()
    ),
    transports: [new transports.Console()]
});

const app = express();

/**
 * Mongo Setup
 * */
mongoose.Promise = global.Promise;
mongoose.connect(CONFIGS.MONGO_URI);

/**
 * Middlewares
 * */
app.use(bodyParser.json());
app.use(expressSession({
    secret: CONFIGS.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: process.env.ENV === 'prod' ?
        {
            secure: true,
            maxAge: CONFIGS.SESSION_LIFE
        } :
        {
            maxAge: CONFIGS.SESSION_LIFE
        }
}));

app.get('/api/top-coins', async (req, res) => {
    try{
        let response = await axios.get('https://chasing-coins.com/api/v1/top-coins/50');

        let arrayfy = [];

        let keys = Object.keys(response.data);

        for(let i =0; i < keys.length; i++) {
            arrayfy.push(response.data[keys[i]]);
        }

        res.json({success: true, data: {coins: arrayfy}});
    }catch(e){
        res.json({success:false})
    }
});

/**
 * Start
 * */
app.listen(CONFIGS.PORT, () => {
    logger.info(`Server Running at PORT : ${CONFIGS.PORT}`);
});