const express = require('express');
const router = express.Router();

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
  try {
    //console.log('Auth');
    res.send('Auth');
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
