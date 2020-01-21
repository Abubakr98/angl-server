const mongoose = require('mongoose');
// const bCrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require('path');
const fse = require('fs-extra');
const authHelper = require('../helpers/authHelper');
const { jwtSecret } = require('../../config/app').jwt;

const User = mongoose.model('User');
const Token = mongoose.model('Token');

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

const updateTokens = (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token,
  }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .exec()
    .then((user) => {
      res.json(user);
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

const comparePass = (pass, userPass) => {
  return new Promise((res) => {
    crypto.scrypt(pass, jwtSecret, 64, (err, dk) => {
      if (userPass === dk.toString('hex')) {
        res(true);
      } else {
        res(false);
      }
    });
  });
};

const signIn = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: 'User does not exist!' });
      } else {
        comparePass(password, user.password).then((passMatch) => {
          if (passMatch) {
            updateTokens(user._id)
              .then(tokens => res.json({ ...tokens, userId: user._id, userEmail: user.email }));
          } else {
            res.status(401).json({ message: 'Invalid credentials!' });
          }
        }).catch((err) => {
          console.log(err);
        });

        // crypto.scrypt(password, jwtSecret, 64, (err, dk) => {
        //   if (user.password === dk.toString('hex')) {
        //     updateTokens(user._id)
        //       .then(tokens => res.json({ ...tokens, userId: user._id, userEmail: user.email }));
        //   } else {
        //     res.status(208).json({ message: 'Invalid credentials!' });
        //   }
        // });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

const registration = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user === null) {
        crypto.scrypt(password, jwtSecret, 64, (err, hash) => {
          if (err === null) {
            User.create({ email, password: hash.toString('hex') })
              .then(createdUser => res.json(createdUser))
              .catch(error => res.status(500).json(error));
          } else {
            res.status(500).json(err);
          }
        });
      } else {
        res.status(401).json({ message: 'User with this email exist!' });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, jwtSecret);
    if (payload.type !== 'refresh') {
      res.status(400).json({ message: 'Invalid token!1' });
      return;
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Refresh token expired!' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'Invalid token!2' });
      return;
    }
  }

  Token.findOne({ tokenId: payload.id })
    .exec()
    .then(token => updateTokens(token.userId))
    .then(tokens => res.json(tokens))
    .catch(err => res.status(400).json({ message: err }));
};


module.exports = {
  signIn,
  refreshTokens,
  registration,
  getAllUsers,
  getUser,
  uploadFile,
  downloadFile,
  getUserAvatar,
  getUserAvatarUrl,
};
