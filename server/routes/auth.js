var express = require('express');
const jsonwebtoken = require('jsonwebtoken')

var router = express.Router();

router.post('/login', function(req, res) {
  

  const { username, password } = req.body
  const valid = username.length && password === '123'


  if (!valid) {
    throw new Error('Invalid username or password')
  }

  const accessToken = jsonwebtoken.sign(
    {
      username,
      picture: 'https://github.com/nuxt.png',
      name: 'User ' + username,
      scope: ['test', 'user']
    },
    'dummy'
  )

  res.json({
    token: {
      accessToken
    }
  })
});

router.post('/logout', function(req, res) {
  res.json({ status: 'OK' })
});

router.get('/user', function(req, res) {
  res.json({ user: req.user })
});

module.exports = router