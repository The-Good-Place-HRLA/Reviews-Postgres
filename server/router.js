const controller = require('./controller');
const router = require('express').Router();

router
  .route('/api')
    .get(controller.getAll)

router
  .route('/api/:productID')
    .get(controller.getOne)
    .post(controller.addReview)
    .put(controller.addHelpful)
    .delete(controller.delete)

module.exports = router;