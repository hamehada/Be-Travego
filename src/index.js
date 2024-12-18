require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { db } = require('../src/models/connection');
const path = require('path');
const morgan = require('morgan');

app.use(cors());
app.use(express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan('dev'));

var routesUser = require("../routes/mobile");
routesUser(app);

var routesAdmin = require("../routes/admin");
routesAdmin(app);


app.use('/images/wisata', express.static(path.join(__dirname, '../images/wisata')));
app.use('/images/transport', express.static(path.join(__dirname, '../images/transport')));
app.use('/images/hotel', express.static(path.join(__dirname, '../images/hotel')));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
