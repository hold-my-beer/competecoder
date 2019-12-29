const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const User = require('../../models/User');

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();

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
// @desc    Get posts by id
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

      const { title, text } = req.body;
      const post = new Post({
        user: user.id,
        avatar: user.avatar,
        title: title,
        text: text
      });

      await post.save();
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
      const { title, text } = req.body;

      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      if (post.user.toString() !== req.user.id) {
        return res
          .status(400)
          .json({ msg: 'Cannot update a post of another user' });
      }

      if (title) post.title = title;
      if (text) post.text = text;

      await post.save();
      return res.json(post);
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

module.exports = router;
