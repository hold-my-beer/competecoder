const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
  try {
    //console.log('Users');
    res.send('Users');
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
