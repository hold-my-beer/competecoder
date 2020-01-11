const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request = require('request');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(res.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    return res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/profile/:userId
// @desc    Get profile by user id
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.userId
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/profile
// @desc    Create / Update profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('country', 'Country is required')
        .not()
        .isEmpty(),
      check('dateOfBirth', 'Date of birth is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills are required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      country,
      dateOfBirth,
      codeforcesHandle,
      skills,
      bio,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (country) profileFields.country = country;
    if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
    if (codeforcesHandle) profileFields.codeforcesHandle = codeforcesHandle;
    if (skills)
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    if (bio) profileFields.bio = bio;

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);

      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    //Delete posts
    await Post.findOneAndRemove({ user: req.user.id });
    //Delete profile if exists - if not, just goes further - no error fired
    await Profile.findOneAndRemove({ user: req.user.id });
    //Delete user
    await User.findOneAndRemove({ _id: req.user.id });

    return res.json({ msg: 'User, profile and posts removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/profile/education
// @desc    Add profile education
// @access  Private
router.post(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('fieldOfStudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, fieldOfStudy, from, to, current } = req.body;

    const newEdu = {
      school,
      fieldOfStudy,
      from,
      to,
      current
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }
      //Check if this education already exists
      let exists = false;
      for (let i = 0; i < profile.education.length; i++) {
        if (
          profile.education[i].school === school &&
          profile.education[i].fieldOfStudy === fieldOfStudy &&
          profile.education[i].from.getTime() === new Date(from).getTime() &&
          profile.education[i].to &&
          to &&
          profile.education[i].to.getTime() === new Date(to).getTime()
        ) {
          exists = true;
          break;
        }
      }
      if (exists) {
        return res.status(400).json({ msg: 'Education already exists' });
      }
      profile.education.unshift(newEdu);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   PUT api/profile/education/:id
// @desc    Update profile education by id
// @access  Private
router.put(
  '/education/:id',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('fieldOfStudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, fieldOfStudy, from, to, current } = req.body;

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }
      //Check if this education exists
      let exists = false;
      for (let i = 0; i < profile.education.length; i++) {
        if (profile.education[i].id === req.params.id) {
          profile.education[i].school = school;
          profile.education[i].fieldOfStudy = fieldOfStudy;
          profile.education[i].from = from;
          profile.education[i].to = to;
          profile.education[i].current = current;
          exists = true;
          break;
        }
      }
      if (!exists) {
        return res.status(400).json({ msg: 'No such education exists' });
      }

      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   DELETE api/profile/education/:id
// @desc    Delete profile education by id
// @access  Private
router.delete('/education/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.id);

    if (removeIndex === -1) {
      return res
        .status(400)
        .json({ msg: 'Cannot delete non-existent education' });
    }
    profile.education.splice(removeIndex, 1);

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(400)
        .json({ msg: 'Cannot delete non-existent education' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/profile/codeforces/:handle
// @desc    Get codeforces user info by handle
// @access  Public
router.get('/codeforces/:handle', (req, res) => {
  try {
    const options = {
      uri: `https://codeforces.com/api/user.info?handles=${req.params.handle}}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      }

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No codeforces profile found' });
      }

      return res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(err.message);
    return status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
