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
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

// Database model setup
const Post = mongoose.model('Post', blogSchema);

// body-parser setup
app.use(bodyParser.urlencoded({ extended: true }));

// ejs setup
app.set('view engine', 'ejs');

// Setup for serving custom stylesheets
app.use(express.static('public'));

/**
 * ROUTES GOES HERE
 */

// Show landing page
app.get('/', (req, res) => {
    res.render('landing');
});

// List all posts
app.get('/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', { posts: posts });
        }
    });
});

// Show new post form
app.get('/posts/new', (req, res) => {
    res.render('new');
});

app.post('/posts', (req, res) => {
    // Create post
    Post.create(req.body.post, (err, post) => {
        if (err) {
            res.render('new'); 
        } else {
            res.redirect('/posts');
            console.log('Created: \n' + post);
        }
    });
 
});

// Show info about one specific post
app.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    Post.findById(id, (err, post) => {
        if (err) {
            res.redirect('/posts');
        } else {
            res.render('show', { post: post });
        }
    });
});

// Show edit form for one post
app.get('/posts/:id/edit', (req, res) => {
    let id = req.params.id;
    Post.findById(id, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.render('edit', { post: post });
        }
    });
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
