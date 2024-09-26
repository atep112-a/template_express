// services/userService.js
const User = require('../models/userModels');

exports.findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw new Error('User not found');
    }
};
