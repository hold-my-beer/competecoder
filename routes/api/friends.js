const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Friendship = require('../../models/Friendship');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/friends
// @desc    Get user friend requests
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ msg: 'Profile not found. Create profile first' });
    }

    const friends = await Friendship.find({
      $or: [{ initiator: req.user.id }, { acceptor: req.user.id }]
    });

    if (!friends) {
      return res.status(404).json({ msg: 'No friend requests found' });
    }

    return res.json(friends);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/friends/:userId
// @desc    Request to become friend of userId
// @access  Private
router.post('/:userId', auth, async (req, res) => {
  try {
    //Check if users have profiles
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({
        msg: 'Profile not found. Create your profile first'
      });
    }

    profile = await Profile.findOne({ user: req.params.userId });

    if (!profile) {
      return res
        .status(404)
        .json({ msg: 'Profile not found. User you requested has no profile' });
    }

    //Check if request for friendship has already been made
    let friendship = await Friendship.findOne({
      $or: [
        { $and: [{ initiator: req.user.id }, { acceptor: req.params.userId }] },
        { $and: [{ initiator: req.params.userId }, { acceptor: req.user.id }] }
      ]
    });

    if (friendship) {
      return res
        .status(400)
        .json({ msg: 'Cannot request for second friendship' });
    }

    const userInitiator = await User.findById(req.user.id);
    const userAcceptor = await User.findById(req.params.userId);

    friendship = new Friendship({
      initiator: req.user.id,
      initiatorName: userInitiator.name,
      initiatorAvatar: userInitiator.avatar,
      acceptor: req.params.userId,
      acceptorName: userAcceptor.name,
      acceptorAvatar: userAcceptor.avatar
    });

    await friendship.save();
    return res.json(friendship);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Profile not found. User you requested has no profile' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/friends/accept/:id
// @desc    Accept friendship by id
// @access  Private
router.put('/accept/:id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ msg: 'Profile not found. Create your profile first' });
    }

    const friendship = await Friendship.findById(req.params.id);
    if (!friendship) {
      return res
        .status(404)
        .json({ msg: 'Request not found. No such request for friendship' });
    }

    if (friendship.acceptor._id != req.user.id) {
      return res.status(400).json({ msg: 'You cannot accept this request' });
    }

    profile = await Profile.findOne({ user: friendship.initiator._id });
    if (!profile) {
      return res.status(404).json({
        msg: 'Profile not found. User you are trying to accept has no profile'
      });
    }

    friendship.isAccepted = true;
    await friendship.save();
    return res.json(friendship);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Request not found. No such request for friendship' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/friends/decline/:id
// @desc    Decline friendship by id
// @access  Private
router.put('/decline/:id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ msg: 'Profile not found. Create your profile first' });
    }

    const friendship = await Friendship.findById(req.params.id);
    if (!friendship) {
      return res
        .status(404)
        .json({ msg: 'Request not found. No such request for friendship' });
    }

    if (friendship.acceptor._id != req.user.id) {
      return res.status(400).json({ msg: 'You cannot delete this request' });
    }

    profile = await Profile.findOne({ user: friendship.initiator._id });
    if (!profile) {
      return res.status(404).json({
        msg: 'Profile not found. User you are trying to accept has no profile'
      });
    }

    friendship.isAccepted = false;
    await friendship.save();
    return res.json(friendship);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Request not found. No such request for friendship' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
