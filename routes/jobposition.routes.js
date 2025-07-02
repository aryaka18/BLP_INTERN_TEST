const router = require('express').Router();
const jobPositionController = require('../../../controllers/settings/jobposition.controllers');

const middleware = require('../../../middlewares/index');

router.post('/', jobPositionController.create);
router.get('/', jobPositionController.findAll);
router.get('/', jobPositionController.findByJobTitle);
router.get('/:id', jobPositionController.findByJobId);
router.put('/:id', jobPositionController.updateById);
router.delete('/', jobPositionController.delete);

module.exports = router;
