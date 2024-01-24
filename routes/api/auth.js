const express = require('express')
const router = express.Router();
const jsonParser = express.json();
const authControllers = require('../../controllers/authControllers');
const authHeader = require('../../service/auth');



router.post('/register', jsonParser, authControllers.addUser);

router.post('/login', jsonParser, authControllers.logUser);

router.post('/logout', authHeader, jsonParser, authControllers.logout);

router.get('/current', authHeader, jsonParser, authControllers.current)



module.exports = router;
