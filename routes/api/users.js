const express = require('express');
const router = express.Router();

//@routes GET api/users/test
//@desc   Test users route
//@access Public

router.get('/test', (req, res)=> res.json({msg:'Users work'}))

module.exports = router;