const mongoose = require('mongoose');

const User = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

export const UserSchema = mongoose.model('User', User);
