const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

const app = express();
const port = 4231;

//Connect to database
mongoose.connect(config.database, {useNewUrlParser: true});
mongoose.connection.on('connected', () => {
    console.log("connected to database " + config.database);
}).on('error', (err) => {
    console.log('ERROR connection to data base: ', err); 
})

// CORS Middleware
app.use(cors());

//Enable Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


//Set routes
app.use('/items', require('./routes/items'));

//Set FrontEnd Folder
app.use(express.static(path.join(__dirname, 'public')));
global.publicFolder = path.resolve(__dirname, "public");

//Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
    console.log('Server started on port '+port);
});
