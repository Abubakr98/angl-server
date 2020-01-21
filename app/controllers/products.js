const mongoose = require('mongoose');

const Product = mongoose.model('Product');

const getAll = (req, res) => {
  // заменить название метода на products так как это не соответсвует REST
  Product.find()
    .exec()
    .then(products => res.status(200).json(products))
    .catch(err => res.status(500).json(err));
};
const getAllJSon = (req, res) => {
  // заменить название метода на products так как это не соответсвует REST
  Product.find()
    .exec()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch(err => res.status(500).json(err));
};
const getById = (req, res) => {
  Product.findOne({ product_id: +req.params.id })
    .exec()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch(err => res.status(500).json(err));
};
const updateOne = (req, res) => {
  Product.findOneAndUpdate({ product_id: +req.params.id }, req.body, { new: true })
    .exec()
    .then((product) => {
      res.status(201).json(product);
    })
    .catch(err => res.status(500).json(err));
};
const removeOne = (req, res) => {
  Product.deleteOne({ product_id: +req.params.id })
    .exec()
    .then((product) => {
      res.json(product);
    })
    .catch(err => res.status(200).status(500).json(err));
};
const createOne = (req, res) => {
  Product.create(req.body)
    .then(createdProduct => res.json(createdProduct))
    .catch(err => res.status(201).status(500).json(err));
};

const pageNotFound = (req, res) => {
  res.status(404).send('404 - страница не найдена!');
};

module.exports = {
  pageNotFound,
  createOne,
  removeOne,
  updateOne,
  getById,
  getAllJSon,
  getAll,
};
