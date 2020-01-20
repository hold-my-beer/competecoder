const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  initiatorName: {
    type: String
  },
  initiatorAvatar: {
    type: String
  },
  acceptor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  acceptorName: {
    type: String
  },
  acceptorAvatar: {
    type: String
  },
  isAccepted: {
    type: Boolean,
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Friendship = mongoose.model('friendship', FriendshipSchema);
