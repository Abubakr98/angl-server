const express = require('express');
const words = require('../../app/controllers/groups');
const authMiddleWare = require('../../middleware/auth');

const router = express.Router();
router
  .route('/')
  .get(
    authMiddleWare,
    words.getAll,
  )
  .post(
    // authMiddleWare,
    words.createOne,
  );
router
  .route('/:id')
  .delete(
    // authMiddleWare,
    words.removeOne,
  )
  .get(
    // authMiddleWare,
    words.getById,
  )
  .put(
    // authMiddleWare,
    words.updateOne,
  );
module.exports = router;
