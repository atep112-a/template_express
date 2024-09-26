const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const userMiddleware = require('../middleware/userMiddleware');


router.post('/login', userController.Postlogin);
router.get('/users', userMiddleware.authenticateToken, userController.getAllUsers);
router.post('/users/create', userController.createUser);
router.put('/users/edit/:email', userMiddleware.authenticateToken, userController.editUser);
router.put('/users/update/:id', userMiddleware.authenticateToken, userController.updateUser);

// Rute untuk refresh token
router.post('/token', userMiddleware.refreshToken);

module.exports = router;
