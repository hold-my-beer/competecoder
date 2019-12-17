const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request = require('request');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

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
    /* */
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

// @route   POST api/profile/requests/:userId
// @desc    Request to become friend of userId
// @access  Private
// router.post('/:userId/requests', auth, async (req, res) => {
//   try {
//     let profile = await Profile.findOne({ user: req.user.id });

//     if (!profile) {
//       return res.status(404).json({
//         msg:
//           'You need to create your profile before requesting to become friends'
//       });
//     }

//     const index = profile.requestsSent;

//     profile = await Profile.findOne({ user: req.params.userId });

//     if (!profile) {
//       return res.status(404).json({ msg: 'User you requested has no profile' });
//     }

//     const index = profile.requestsReceived
//       .map(item => item.id)
//       .indexOf(req.user.id);

//     if (index !== -1) {
//       return res.status(400).json({
//         msg:
//           'You have already registered a request to become friends with this user'
//       });
//     }

//     profile.requestsReceived.unshift(req.user.id);
//     await profile.save();
//     return res.json('Your request registered');
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'User you requested has no profile' });
//     }
//     return res.status(500).json({ msg: 'Server Error' });
//   }
// });

// @route   DELETE api/profile/:userId/requests
// @desc    Delete own request to become friend of userId
// @access  Private
// router.delete('/:userId/requests', auth, async (req, res) => {
//   try {
//     let profile = await Profile.findOne({ user: req.user.id });

//     if (!profile) {
//       return res.status(404).json({
//         msg:
//           'You need to create your profile before requesting to become friends'
//       });
//     }

//     profile = await Profile.findOne({ user: req.params.userId });

//     if (!profile) {
//       return res.status(404).json({ msg: 'User you requested has no profile' });
//     }

//     const removeIndex = profile.requests
//       .map(item => item.id)
//       .indexOf(req.user.id);
//     if (removeIndex === -1) {
//       return res.status(404).json({ msg: 'No request found' });
//     }

//     profile.requests.splice(removeIndex, 1);
//     await profile.save();
//     return res.json({ msg: 'Your request was deleted' });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'User you requested has no profile' });
//     }
//     return res.status(500).json({ msg: 'Server Error' });
//   }
// });

// @route   PUT api/profile/requests/accept/:userId
// @desc    Accept request to become friends
// @access  Private
// router.put('/requests/accept/:userId', auth, async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ user: req.user.id });

//     if (!profile) {
//       return res.status(404).json({ msg: 'Profile not found' });
//     }

//     const removeIndex = profile.requests
//       .map(item => item.id)
//       .indexOf(req.params.userId);
//     if (removeIndex === -1) {
//       return res.status(404).json('Request not found');
//     }

//     profile.requests.splice(removeIndex, 1);

//     const index = profile.friends
//       .map(item => item.id)
//       .indexOf(req.params.userId);
//     if (index !== -1) {
//       return res.status(400).json({ msg: 'User is already a friend of yours' });
//     }

//     profile.friends.unshift(req.params.userId);
//     await profile.save();
//     return res.json(profile);
//   } catch (err) {
//     console.error(er.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Request not found' });
//     }
//     return res.status(500).json({ msg: 'Server Error' });
//   }
// });

module.exports = router;
