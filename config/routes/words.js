const express = require('express');
const words = require('../../app/controllers/words');

const router = express.Router();
router
  .route('/')
  .get(
    // authMiddleWare,
    words.getAll,
  )
  .post(
    // authMiddleWare,
    words.createOne,
  ).delete(
    // authMiddleWare,
    words.removeMany,
  );
router
  .route('/:group')
  .get(
    // authMiddleWare,
    words.getByGroup,
  );
router
  .route('/:id')
  .put(
    // authMiddleWare,
    words.updateOne,
  );
module.exports = router;
