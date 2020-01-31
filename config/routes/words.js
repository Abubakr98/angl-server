const express = require('express');
const words = require('../../app/controllers/words');

const router = express.Router();
router
  .route('/')
  .get(
    // authMiddleWare,
    words.getAllJSon,
  )
  .post(
    // authMiddleWare,
    words.createOne,
  );
router
  .route('/:group')
  .get(
    // authMiddleWare,
    words.getByGroup,
  );
// router
//   .route('/:id')
//   .put(
//     // authMiddleWare,
//     words.updateOne,
//   )
//   .delete(
//     // authMiddleWare,
//     words.removeOne,
//   );
module.exports = router;
