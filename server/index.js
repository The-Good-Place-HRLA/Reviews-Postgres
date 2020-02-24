require('newrelic');
const express = require('express');

const path = require('path');
const router = require('./router');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 6969;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}))
app.use(morgan('dev'));


app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/', router);
app.use('/:id', express.static(path.join(__dirname, '../client/dist')));



app.listen(port, console.log('server up on ', port));