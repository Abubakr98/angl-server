const express = require('express');
const products = require('../../app/controllers/products');

const router = express.Router();
// products
// router.get(
//   '/',
//   // authMiddleWare,
//   products.getAll,
// );
router
  .route('/')
  .get(
    // authMiddleWare,
    products.getAllJSon,
  )
  .post(
    // authMiddleWare,
    products.createOne,
  );
router
  .route('/:id')
  .get(
    // authMiddleWare,
    products.getById,
  )
  .put(
    // authMiddleWare,
    products.updateOne,
  )
  .delete(
    // authMiddleWare,
    products.removeOne,
  );
module.exports = router;
