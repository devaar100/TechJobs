const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Profile = new Schema({
    uid: {
        type: String,
        index: true
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    gender: {
        type: String
    },
    year: {
        type: String
    },
    college: {
        type: String
    },
    college_full: {
        type: String
    },
    branch: {
        type: String
    },
    branch_full: {
        type: String
    },
    cgpa: {
        type: String
    },
    cc: {
        type: String
    },
    cc_rating: {
        type: String
    },
    cf: {
        type: String
    },
    cf_rating: {
        type: String
    },
    linkedin: {
        type: String
    },
    resume: {
        type: String
    },
    github: {
        type: String
    },
    open_source: {
        type: String
    },
    work_ex: {
        type: String
    },
    miscellaneous: {
        type: String
    },
});

module.exports = mongoose.model('Profile', Profile);
