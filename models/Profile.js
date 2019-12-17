const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  country: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  codeforcesHandle: {
    type: String
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  friends: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId
        // ref: 'user'
      }
    }
  ],
  requestsSent: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId
        // ref: 'user'
      }
    }
  ],
  requestsReceived: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId
        // ref: 'user'
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      fieldOfStudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
