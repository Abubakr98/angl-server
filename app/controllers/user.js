const mongoose = require('mongoose');
const path = require('path');
const fse = require('fs-extra');

const User = mongoose.model('User');
const Word = mongoose.model('Word');

const uploadFile = (req, res) => {
  const filedata = req.file;
  console.log(req.params.id);
  if (!filedata) {
    res.send('Ошибка при загрузке файла');
  } else {
    res.send('Файл загружен');
  }
};

const downloadFile = (req, res) => {
  const upload = path.join('public', 'uploads');
  fse.readdir(path.join(upload, req.params.id)).then((files) => {
    const fileName = files.map((el, i) => {
      if (el.indexOf('avatar')) {
        return el;
      }
    })[0];
    const file = path.normalize(`${upload}/${req.params.id}/${fileName}`);
    res.download(file);
  });
};

const getUserAvatar = (req, res) => {
  const upload = path.join('public', 'uploads');
  fse.readdir(path.join(upload, req.params.id)).then((files) => {
    const fileName = files.map((el, i) => {
      if (el.indexOf('avatar')) {
        return el;
      }
    })[0];
    const file = path.normalize(`${upload}/${req.params.id}/${fileName}`);
    fse.readFile(file, 'base64').then((avatar) => {
      res.json({ userId: 'tobi', avatar });
    });
  });
};
const getUserAvatarUrl = (req, res) => {
  const upload = path.join('public', 'uploads');
  fse.readdir(path.join(upload, req.params.id)).then((files) => {
    const fileName = files.map((el, i) => {
      if (el.indexOf('avatar')) {
        return el;
      }
    })[0];
    const avatar = `uploads/${req.params.id}/${fileName}`;
    res.json({ userId: 'tobi', avatar });
  });
};

const getUser = (req, res) => {
  User.findOne({ id: req.params.id })
    .exec()
    .then((user) => {
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
};
const unique = (arr) => {
  return new Promise((res, rej) => {
    const groups = arr.map(el => el.group);
    res(Array.from(new Set(groups)));
  });
};
const wordsCountByGroup = (groups, words) => {
  return new Promise((res, rej) => {
    const arr = [];
    groups.map((g) => {
      let buff = 0;
      words.map((w) => {
        if (w.group === g) {
          buff += 1;
        }
      });
      arr.push({ group: g, words: buff });
    });
    res(arr);
  });
};
const getUserGroups = (req, res) => {
  User.findOne({ id: req.params.id })
    .exec()
    .then((user) => {
      const groups = unique(user.words);
      groups.then((ug) => {
        const wcbg = wordsCountByGroup(ug, user.words);
        wcbg.then(data => res.json(data));
        // res.json(ug);
      });
    })
    .catch(err => res.status(500).json(err));
};
const getUserWords = (req, res) => {
  User.findOne({ id: req.params.id })
    .exec()
    .then((user) => {
      Word.find().then((data) => {
        const buff = [];
        user.words.map((el, i) => {
          buff.push(data.find(word => word.id === el.id));
        });
        res.json(buff);
      });
    })
    .catch(err => res.status(500).json(err));
};
const getAllUsers = (req, res) => {
  User.find()
    .exec()
    .then((user) => {
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
};

const addUserWord = (req, res) => {
  const wordId = req.body.id;

  User.findOne({ id: req.params.id })
    .exec()
    .then((user) => {
      Word.findOne({ id: wordId })
        .exec()
        .then((word) => {
          const { id, group, _id } = word;
          const isWord = user.words.id(_id);

          if (isWord === null) {
            user.words.push({
              _id,
              id,
              group,
              is_learned: true,
            });
            user.save((err) => {
              if (err) return handleError(err);
              console.log('Success!');
            });
            res.json(user);
          } else {
            res.status(400).json({ message: 'Word already exist!' });
          }
        });
    })
    .catch(err => res.status(500).json(err));
};


module.exports = {
  getAllUsers,
  getUser,
  uploadFile,
  downloadFile,
  getUserAvatar,
  getUserAvatarUrl,
  addUserWord,
  getUserGroups,
  getUserWords,
};