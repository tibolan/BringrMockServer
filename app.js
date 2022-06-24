const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser')

const CorsOptions = {
    "origin": "*",
    "headers": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}


const indexRouter = require('./routes/index');

const app = express();
app.use(cors(CorsOptions));
// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(async function (req, res, next) {
    let delay = Number(req.query.sleep)
    if (delay) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve({})
            }, delay)
        })
    }
    next()
});

app.use('/', indexRouter);

module.exports = app;
