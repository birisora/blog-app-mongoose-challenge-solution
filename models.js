'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: {
    type: String,
    unique: true
  }
});

const commentSchema = mongoose.Schema({ content: String });

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  // created: { type: Date, default: Date.now },
  comments: [commentSchema]
});

postSchema.pre('find', function (next) {
  // function known as pre hook lets blog post schema
  // serialize method access authorName virtual prop after call find
  this.populate('author');
  next();
});

postSchema.pre('findOne', function (next) {
  this.populate('author');
  next();
});

postSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

postSchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    // created: this.created,
    comments: this.comments
  };
};

const Post = mongoose.model('Post', postSchema);
const Author = mongoose.model('Author', authorSchema);

module.exports = { Post, Author };
