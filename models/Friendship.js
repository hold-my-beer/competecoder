const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  acceptor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  isAccepted: {
    type: Boolean,
    default: null
  }
});

module.exports = Friendship = mongoose.model('friendship', FriendshipSchema);
