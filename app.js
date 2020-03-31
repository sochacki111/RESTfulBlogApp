const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

/**
 * SETUP GOES HERE
 */

// Database setup
mongoose.connect('mongodb://localhost:27017/restful-blog', {
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

// Show landing page
app.get('/', (req, res) => {
    res.render('landing');
});

// List all posts
app.get('/posts', (req, res) => {
    res.render('index');
});

// Show new post form
app.get('/posts/new', (req, res) => {
    res.render('new');
});

app.post('/posts', (req, res) => {
    res.redirect('posts');
});

// Show info about one specific post
app.get('/posts/:id', (req, res) => {
    res.render('show');
});

// Show edit form for one post
app.get('/posts/:id/edit', (req, res) => {
    res.render('edit');
});

app.put('/posts/:id', (req, res) => {
    res.redirect('/posts/:id');
});

app.delete('/post/:id', (req, res) => {
    res.redirect('/posts');
});

// Server listening
app.listen(port, () => {
    console.log('RESTful Blog App server started!');
});