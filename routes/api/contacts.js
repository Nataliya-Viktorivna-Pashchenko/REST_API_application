const express = require('express')
const router = express.Router();
const jsonParser = express.json();
const controllers = require('../../service/controllers')



router.get('/', controllers.getAll)

router.get('/:id', controllers.getById)

router.post('/', jsonParser, controllers.add)

router.delete('/:id', controllers.deleteById)

router.put('/:id', jsonParser, controllers.put)

module.exports = router;
