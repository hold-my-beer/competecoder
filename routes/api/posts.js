const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Friendship = require('../../models/Friendship');

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    if (!posts) {
      return res.status(404).json({ msg: 'Posts not found' });
    }

    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [
    auth,
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        user: user.id,
        avatar: user.avatar,
        name: user.name,
        text: req.body.text
      });

      const post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      if (post.user.toString() !== req.user.id) {
        return res
          .status(400)
          .json({ msg: 'Cannot update a post of another user' });
      }

      if (text) post.text = text;

      const newPost = await post.save();
      return res.json(newPost);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      return res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res
        .status(400)
        .json({ msg: 'Cannot delete a post of another user' });
    }

    await post.remove();
    return res.json('Post removed');
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'You have already liked this post' });
    }

    const removeIndex = post.dislikes
      .map(dislike => dislike.user)
      .indexOf(req.user.id);

    if (removeIndex === -1) {
      post.likes.unshift({ user: req.user.id });
    } else {
      post.dislikes.splice(removeIndex, 1);
    }

    const newPost = await post.save();
    return res.json({ likes: newPost.likes, dislikes: newPost.dislikes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (
      post.dislikes.filter(dislike => dislike.user.toString() === req.user.id)
        .length > 0
    ) {
      return res
        .status(400)
        .json({ msg: 'You have already disliked this post' });
    }

    const removeIndex = post.likes.map(like => like.user).indexOf(req.user.id);

    if (removeIndex === -1) {
      post.dislikes.unshift({ user: req.user.id });
    } else {
      post.likes.splice(removeIndex, 1);
    }
    const newPost = await post.save();
    return res.json({ likes: newPost.likes, dislikes: newPost.dislikes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/posts/comments/:postId
// @desc    Comment a post
// @access  Private
router.post(
  '/comments/:postId',
  [
    auth,
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const user = await User.findById(req.user.id).select('-password');

      const { text } = req.body;
      post.comments.unshift({
        user: user.id,
        avatar: user.avatar,
        name: user.name,
        text
      });
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }

      return res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   DELETE api/posts/comments/:postId/:id
// @desc    Delete comment by id
// @access  Private
router.delete('/comments/:postId/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const removeIndex = post.comments
      .map(comment => comment.id.toString())
      .indexOf(req.params.id);
    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (post.comments[removeIndex].user.toString() !== req.user.id) {
      console.log(post.comments[removeIndex].user);
      console.log(req.user.id);
      return res
        .status(400)
        .json({ msg: 'Cannot delete a comment of another user' });
    }

    post.comments.splice(removeIndex, 1);
    await post.save();
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/posts/created/:requestId
// @desc    Get posts created by the user by requestId
// @access  Private
// router.get('/created/:requestId', auth, async (req, res) => {
//   try {
//     const request = await Friendship.findById(req.params.requestId);
//     if (!request) {
//       return res.status(404).json({ msg: 'No such friend found' });
//     }

//     const friendId =
//       request.initiator === req.user.id ? request.acceptor : request.initiator;
//     const checkDate =
//       request.initiator === req.user.id
//         ? acceptorPostsCheckDate
//         : initiatorPostsCheckDate;

//     const posts = await Post.find({ user: friendId });

//     const newPosts = posts.filter(post => post.date > checkDate);

//     return res.json(newPosts);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     return res.status(500).json({ msg: 'Server Error' });
//   }
// });

// @route   GET api/posts/newposts/:userId
// @desc    Get new posts by userId
// @access  Private
router.get('/newposts/:userId', auth, async (req, res) => {
  try {
    const request = await Friendship.findOne({
      $or: [
        { $and: [{ initiator: req.user.id }, { acceptor: req.params.userId }] },
        { $and: [{ initiator: req.params.userId }, { acceptor: req.user.id }] }
      ]
    });

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    const checkDate =
      request.initiator === req.user.id
        ? new Date(request.initiatorCheckDate)
        : new Date(request.acceptorCheckDate);

    const posts = await Post.find({
      $or: [
        { $and: [{ user: req.params.userId }, { date: { $gt: checkDate } }] },
        {
          $and: [
            { 'comments.user': req.params.userId },
            { 'comments.date': { $gt: checkDate } }
          ]
        },
        {
          $and: [
            { 'likes.user': req.params.userId },
            { 'likes.date': { $gt: checkDate } }
          ]
        }
      ]
    }).sort({ date: -1 });

    if (!posts) {
      return status(404).json({ msg: 'Posts not found' });
    }

    // console.log(posts);

    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
