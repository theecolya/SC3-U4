const router = require('express').Router();
const Auth = require('./auth-model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets')
const Mw = require('./auth-middleware')

router.post('/register', Mw.checkUsername, Mw.checkCredentials, (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel", // must not exist already in the `users` table
      "password": "foobar"          // needs to be hashed before it's saved
    }
  */  
  const credentials = req.body
  const hash = bcrypt.hashSync(credentials.password, 14)
  credentials.password = hash

  Auth.register(credentials).then(user => {
    if(credentials.username && credentials.password) {
      return res.status(200).json({
              id: user.id,
              username: credentials.username,
              password: hash
    })}
  })
  .catch(err => {
    console.log(err)
  })

  /*
    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */  
      const credentials = req.body
      Auth.fetchUserByUsername(credentials.username).then(user => {
        if(user && bcrypt.compareSync(credentials.password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `welcome, ${user.username}`,
            token: token
          })
        } else {
          res.status(401).json('invalid credentials')
        }
      })
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '24h'
  }
  return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;
