let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/demo', (req, res, next) => {
  res.render('demo', { title: 'Express' });
});

module.exports = router;
