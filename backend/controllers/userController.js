const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
  const { username, password } = req.body;

  
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password.' });
  }

  try {

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }


    const hashedPassword = await bcrypt.hash(password, 12); 

    const newUser = new User({
      username,
      password: hashedPassword,
    });


    await newUser.save();


    res.status(201).json({ message: 'User created successfully. Please log in.' });

  } catch (error) {

    console.error('SIGNUP ERROR:', error); 
    res.status(500).json({ message: 'Internal Server Error. Could not sign up user.' });
  }
};



exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password.' });
  }

  try {

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' }); 
    }


    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not found in environment variables.');
    }


    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

   
    res.status(200).json({ token, userId: user._id });

  } catch (error) {
    console.error('LOGIN ERROR:', error); 
    res.status(500).json({ message: 'Internal Server Error. Could not log in user.' });
  }
};