const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Post = new Schema({
    postedBy: {
        type: Schema.Types.String
    },
    dateCreated: {
        type: Schema.Types.String
    },
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }],
    uids: [{
        type: Schema.Types.String
    }],
    company: {
        type: Schema.Types.String
    },
    profile: {
        type: Schema.Types.String
    },
    openFor: {
        type: Schema.Types.String
    },
    description: {
        type: Schema.Types.String
    },
    profileURL: {
        type: Schema.Types.String
    },
    isAccepting: {
        type: Schema.Types.Boolean
    }
});

module.exports = mongoose.model('Post', Post);
