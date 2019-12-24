const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  avatar: {
    type: String
  },
  title: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  dislikes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      avatar: {
        type: String
      },
      text: {
        type: String,
        required: true
      },
      likes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
          }
        }
      ],
      dislikes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
          }
        }
      ],
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
