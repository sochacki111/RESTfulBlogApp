const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

/**
 * SETUP GOES HERE
 */

// Database setup
mongoose.connect('mongodb://localhost:27017/lkjdsfj', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database schema setup
const blogSchema = new mongoose.Schema({
    name: String,
    description: String
});

// Database model setup
const Post = mongoose.model('Post', blogSchema);

// body-parser setup
app.use(bodyParser.urlencoded({ extended: true }));

// ejs setup
app.set('view engine', 'ejs');

/**
 * ROUTES GOES HERE
 */

app.get('/', (req, res) => {
    res.render('landing');
});

// Server listening
app.listen(port, () => {
    console.log('RESTful Blog App server started!');
});
