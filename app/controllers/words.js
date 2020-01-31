const mongoose = require('mongoose');

const Word = mongoose.model('Word');

const getAll = (req, res) => {
  // заменить название метода на products так как это не соответсвует REST
  Word.find()
    .exec()
    .then(Words => res.status(200).json(Words))
    .catch(err => res.status(500).json(err));
};
const getAllJSon = (req, res) => {
  // заменить название метода на products так как это не соответсвует REST
  Word.find()
    .exec()
    .then((Words) => {
      res.status(200).json(Words);
    })
    .catch(err => res.status(500).json(err));
};
const getByGroup = (req, res) => {
  Word.find({ group: req.params.group })
    .exec()
    .then((words) => {
      res.status(200).json(words);
    })
    .catch(err => res.status(500).json(err));
};
// const updateOne = (req, res) => {
//   Product.findOneAndUpdate({ product_id: +req.params.id }, req.body, { new: true })
//     .exec()
//     .then((product) => {
//       res.status(201).json(product);
//     })
//     .catch(err => res.status(500).json(err));
// };
const removeOne = (req, res) => {
  Word.deleteOne({ id: +req.params.id })
    .exec()
    .then((product) => {
      res.json(product);
    })
    .catch(err => res.status(200).status(500).json(err));
};
const createOne = (req, res) => {
  Word.create(req.body)
    .then(createdWord => res.json(createdWord))
    .catch(err => res.status(201).status(500).json(err));
};

module.exports = {
  createOne,
  removeOne,
  // updateOne,
  getByGroup,
  getAllJSon,
  getAll,
};
