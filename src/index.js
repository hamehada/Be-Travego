const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { db } = require('../src/models/connection');
const path = require('path');


app.use(cors());
app.use(express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


var routesUser = require("../routes/mobile");
routesUser(app);

var routesAdmin = require("../routes/admin");
routesAdmin(app);


app.listen(3000, () => {
    console.log('wooop');
});
