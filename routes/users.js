const auth = require('../middleware/auth');
const { User, validate } = require('../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const { token } = require('morgan');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

router.get('/me', auth ,async (req, res) => { 
  const user= await User.findById(req.user._id).select('-password')
  res.send(user); 
});

router.post('/',auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already exists...');
 
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt =  await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey') );
  res.header('x-auth-token',token).send(_.pick(user, ['name', 'email']));
});

module.exports = router; 