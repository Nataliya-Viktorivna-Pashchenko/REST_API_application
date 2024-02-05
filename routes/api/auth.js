const express = require('express')
const router = express.Router();
const jsonParser = express.json();
const authControllers = require('../../controllers/authControllers');
const authHeader = require('../../service/auth');
const upload = require('../../service/upload')



router.post('/register', jsonParser, authControllers.addUser);

router.post('/login', jsonParser, authControllers.logUser);

router.post('/logout', authHeader, jsonParser, authControllers.logout);

router.get('/current', authHeader, jsonParser, authControllers.current);

router.patch('/', authHeader, jsonParser, authControllers.changeSubscription);

router.patch('/avatars',authHeader, upload.single('avatar'), authControllers.avatar);

router.get('/verify/:verificationToken', authControllers.verifyEmail);

router.post('/verify', jsonParser, authControllers.verifyEmailAgain);



module.exports = router;
