const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb+srv://JayShukla:jayshukla@cluster0.9zippbx.mongodb.net/Mock9')


const User= mongoose.model('User',mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: Date,
    bio: String,
    posts: [],
    friends: [],
    friendRequests: []
}));


const Post = mongoose.model('Post',mongoose.Schema({

    user: {},
    text: String,
    image: String,
    createdAt: Date,
    likes: [],
    comments: [{
      user: {},
      text: String,
      createdAt: Date
    }]

}))


module.exports={connection,User,Post}