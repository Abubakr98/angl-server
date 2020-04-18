const mongoose = require('mongoose');

const Word = mongoose.model('Word');

const getAll = (req, res) => {
  // заменить название метода на products так как это не соответсвует REST
  Word.find().sort({ field: 'asc', id: 1 })
    .exec()
    .then(Words => res.status(200).json(Words))
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
const updateOne = (req, res) => {
  delete req.body._id;
  delete req.body.__v;
  Word.findOneAndUpdate({ id: +req.params.id }, req.body, { new: true })
    .exec()
    .then((product) => {
      res.status(200).json(product);
    })
    .catch(err => res.status(500).json(err));
};
const removeMany = (req, res) => {
  Word.deleteMany({ id: { $in: req.body.ids } })
    .exec()
    .then((product) => {
      res.status(200).json(product);
    })
    .catch(err => res.status(500).json(err));
};
const createOne = (req, res) => {
  Word.create(req.body)
    .then(createdWord => res.status(201).json(createdWord))
    .catch(err => res.status(500).json(err));
};

module.exports = {
  createOne,
  removeMany,
  updateOne,
  getByGroup,
  getAll,
};
