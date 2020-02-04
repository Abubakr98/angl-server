/* eslint-disable no-plusplus */
const mongoose = require('mongoose');

const Group = mongoose.model('Group');
const Word = mongoose.model('Word');

const getAllHelper = (group) => {
  return new Promise((res) => {
    Word.find().then((words) => {
      const buff = [];
      group.map((el) => {
        let count = 0;
        words.map((word) => {
          if (word.group === el._id) {
            count += 1;
          }
        });
        buff.push({
          ...el._doc,
          words: count,
        });
      });
      res(buff);
    });
  });
};

const getAll = (req, res) => {
  // заменить название метода на products так как это не соответсвует REST
  Group.find()
    .exec()
    .then((group) => {
      getAllHelper(group).then((data) => {
        res.status(200).json(data);
      }).catch((err) => {
        console.log(err);
      });
    })
    .catch(err => res.status(500).json(err));
};
const getAllJSon = (req, res) => {
  // заменить название метода на products так как это не соответсвует REST
  Group.find()
    .exec()
    .then((Groups) => {
      res.status(200).json(Groups);
    })
    .catch(err => res.status(500).json(err));
};
const getById = (req, res) => {
  Group.findById({ _id: req.params.id })
    .exec()
    .then((group) => {
      res.status(200).json(group);
    })
    .catch(err => res.status(500).json(err));
};
const updateOne = (req, res) => {
  delete req.body.id;
  delete req.body.__v;
  Group.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .exec()
    .then((group) => {
      res.status(201).json(group);
    })
    .catch(err => res.status(500).json(err));
};
const removeOne = (req, res) => {
  Group.findOneAndRemove({ _id: req.params.id })
    .exec()
    .then((group) => {
      res.json(group);
    })
    .catch(err => res.status(200).status(500).json(err));
};
const createOne = (req, res) => {
  const { _id } = req.body;
  Group.findOne({ _id })
    .exec()
    .then((group) => {
      if (group === null) {
        Group.create(req.body)
          .then(createdGroup => res.json(createdGroup))
          .catch(err => res.status(201).status(500).json({ message: err.message }));
      } else {
        res.status(401).json({ message: 'This group already exist!' });
      }
    }).catch(err => res.status(500).json({ message: err.message }));
};

module.exports = {
  createOne,
  removeOne,
  updateOne,
  getById,
  getAllJSon,
  getAll,
};