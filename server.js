const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const profileRoutes = express.Router();
const jobRoutes = express.Router();
const PORT = 4000;
const path = require("path")

let Profile = require('./models/profile.model');
let Post = require('./models/post.model');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")))
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

profileRoutes.route('/').get(function(req, res) {
    Profile.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

profileRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Profile.findOne({uid: id}, function(err, profile) {
        res.json(profile);
    });
});

profileRoutes.route('/update/:id').post(function(req, res) {
    let id = req.params.id;
    Profile.findOne({uid: id}, function(err, profile) {
        if (!profile) {
            profile = new Profile(req.body);
            profile.save()
                .then(profile => {
                    res.status(200).json({'profile': 'profile updated successfully'});
                    alert('Profile updated successfully')
                })
                .catch(err => {
                    res.status(400).send('adding new profile failed');
                });
        } else {
            profile = Object.assign(profile, req.body)
            profile.save().then(profile => {
                res.status(200).json({'profile': 'profile updated successfully'});
                alert('Profile updated successfully')
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    }, {upsert: true, new: true, setDefaultsOnInsert: true});
});

jobRoutes.route('/').get(function(req, res) {
    Post.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

jobRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Post.findById(id, function(err, job) {
        res.json(job);
    });
});

jobRoutes.route('/profiles/:id').get(function(req, res) {
    let id = req.params.id;
    console.log('Reached here', id)
    Post.findById(id)
        .populate('applicants')
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
});

jobRoutes.route('/update/:id').post(function(req, res) {
    let id = req.params.id;
    Post.findById(id, function(err, job) {
        if (!job) {
            job = new Post(req.body);
            job.save()
                .then(job => {
                    res.status(200).json({'post': 'post updated successfully'});
                    alert('Post updated successfully')
                })
                .catch(err => {
                    res.status(400).send('adding new post failed');
                });
        } else {
            job = Object.assign(job, req.body)
            job.save().then(profile => {
                res.status(200).json({'job': 'job updated successfully'});
                alert('Job updated successfully')
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        }
    }, {upsert: true, new: true, setDefaultsOnInsert: true});
});

jobRoutes.route('/apply/:id').post(function(req, res) {
    let id = req.params.id
    Profile.findOne({uid: id}, function(err, profile) {
        try {
            const userId = profile._id
        } catch (e) {
            console.log(e)
            res.status(200).send("Profile incomplete")
        }
        Post.findById(req.body._id, function(err, job) {
            job = Object.assign(job, req.body)
            job.applicants.push(profile._id)
            job.save().then(profile => {
                res.status(200).json({'job': 'job updated successfully'});
                alert('Job updated successfully')
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        });
    });
});

app.use('/profiles', profileRoutes);
app.use('/jobs', jobRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(process.env.PORT || PORT, function() {
    console.log("Server is running on : " + (process.env.PORT || PORT));
});
