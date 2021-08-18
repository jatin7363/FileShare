const router = require('express').Router();

router.get('/', async (req, res) => {
  // res.render('download', { error: 'Link has been expired.' });
  res.render('index',{}); // find the file in view folder with index name // {} we can send data to front end
});


module.exports = router;