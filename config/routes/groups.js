const express = require('express');
const groups = require('../../app/controllers/groups');
const authMiddleWare = require('../../middleware/auth');

const router = express.Router();
router
  .route('/')
  .get(
    // authMiddleWare,
    groups.getAll,
  )
  .post(
    // authMiddleWare,
    groups.createOne,
  )
  .delete(
    // authMiddleWare,
    groups.removeOne,
  );
router
  .route('/:id')

  .get(
    // authMiddleWare,
    groups.getById,
  )
  .put(
    // authMiddleWare,
    groups.updateOne,
  );
module.exports = router;
