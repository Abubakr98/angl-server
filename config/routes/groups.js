const express = require('express');
const words = require('../../app/controllers/groups');

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
  );
module.exports = router;
