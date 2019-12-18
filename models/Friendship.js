const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
  users: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  isConfirmed: {
    type: Boolean,
    default: false
  }
});

module.exports = Friendship = mongoose.model('friendship', FriendshipSchema);
