const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = express.Router();
const PORT = 4000;
const path = require("path")

let Profile = require('./profile.model');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")))

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

routes.route('/').get(function(req, res) {
    Profile.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

routes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Profile.findOne({uid: id}, function(err, profile) {
        res.json(profile);
    });
});

routes.route('/update/:id').post(function(req, res) {
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

app.use('/profiles', routes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(process.env.PORT || PORT, function() {
    console.log("Server is running on : " + (process.env.PORT || PORT));
});
