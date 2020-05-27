const mongoose = require('mongoose');
const path = require('path');
const fse = require('fs-extra');

const Word = mongoose.model('Word');


const wordImageUrl = (wordId) => {
  const upload = path.join('public', 'wordImages');
  if (fse.pathExistsSync(path.join(upload, `${wordId}`))) {
    const files = fse.readdirSync(path.join(upload, `${wordId}`));
    const fileName = files.map((el) => {
      if (el.indexOf('wordImage')) {
        return el;
      }
    })[0];
    const image = `wordImages/${wordId}/${fileName}`;
    return image;
  }
  return null;
};
const getAll = (req, res) => {
  Word.find().sort({ field: 'asc', id: 1 })
    .exec()
    .then((Words) => {
      const W = Words.map((el) => {
        const {
          des, en, examples, group, id, ua, _id,
        } = el;
        return {
          des, en, examples, group, id, ua, _id, image: wordImageUrl(el._id),
        };
      });
      res.status(200).json(W);
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
const uploadFile = (req, res) => {
  const filedata = req.file;
  if (!filedata) {
    res.send('Ошибка при загрузке файла');
  } else {
    res.send('Файл загружен');
  }
};
const getUserWordImageUrl = (req, res) => {
  const upload = path.join('public', 'wordImages');
  fse.readdir(path.join(upload, req.params.id)).then((files) => {
    const fileName = files.map((el) => {
      if (el.indexOf('wordImage')) {
        return el;
      }
    })[0];
    const image = `wordImages/${req.params.id}/${fileName}`;
    res.json({ wordId: req.params.id, image });// image
  });
};
module.exports = {
  createOne,
  removeMany,
  updateOne,
  getByGroup,
  getAll,
  uploadFile,
  getUserWordImageUrl,
};
