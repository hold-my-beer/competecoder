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
  initiatorCheckDate: {
    type: Date,
    default: Date.now
  },
  // initiatorNewPosts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'post'
  //   }
  // ],
  // initiatorNewCommentedPosts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'post'
  //   }
  // ],
  // initiatorNewLikedPosts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'post'
  //   }
  // ],
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
  acceptorCheckDate: {
    type: Date,
    default: Date.now
  },
  // acceptorNewPosts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'post'
  //   }
  // ],
  // acceptorNewCommentedPosts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'post'
  //   }
  // ],
  // acceptorNewLikedPosts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'post'
  //   }
  // ],
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
