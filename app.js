const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
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

// ejs setup
app.set('view engine', 'ejs');
// body-parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
// Setup for serving custom stylesheets
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Database schema setup
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

// Database model setup
const Post = mongoose.model('Post', blogSchema);

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
    // Sanitize request
    req.body.post.body = req.sanitize(req.body.post.body);
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
            res.redirect('/posts');
        } else {
            res.render('edit', { post: post });
        }
    });
});

app.put('/posts/:id', (req, res) => {
    // Sanitize request
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedPost) => {
        if (err) {
            res.redirect('/posts');
        } else {
            res.redirect(`/posts/${req.params.id}`);
        }
    });
});

app.delete('/posts/:id', (req, res) => {
    // destroy blog
    Post.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.redirect('/posts');
        } else {
            res.redirect('/posts');
        }
    });
});

// Server listening
app.listen(port, () => {
    console.log('RESTful Blog App server started!');
});
