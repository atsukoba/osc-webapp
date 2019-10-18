let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/tiles', (req, res) => {
  res.render('tiles', { title: 'Express' });
});

router.get('/throw', (req, res) => {
  res.render('throw', { title: 'Express' });
});

module.exports = router;
