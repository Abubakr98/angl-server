const mongoose = require('mongoose');
// const bCrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const authHelper = require('../helpers/authHelper');
const { jwtSecret } = require('../../config/app').jwt;
const config = require('../../config/email.json');
const FURL = require('../../config/front-urls');

const User = mongoose.model('User');
const Token = mongoose.model('Token');


const updateTokens = (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token,
  }));
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
              .then(tokens => res.json({
                ...tokens,
                userId: user._id,
                userEmail: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
              }));
          } else {
            res.status(401).json({ message: 'Invalid credentials!' });
          }
        }).catch((err) => {
          res.status(500).json({ message: err.message });
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
  const {
    firstName, lastName, email, password,
  } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user === null) {
        crypto.scrypt(password, jwtSecret, 64, (err, hash) => {
          if (err === null) {
            User.create({
              firstName, lastName, email, password: hash.toString('hex'),
            })
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

const refreshPass = (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  User.findOne({ tokenRefreshPassword: token })
    .exec()
    .then((user) => {
      if (user !== null) {
        crypto.scrypt(password, jwtSecret, 64, (err, hash) => {
          if (err === null) {
            User.findOneAndUpdate({ tokenRefreshPassword: token }, { password: hash.toString('hex'), tokenRefreshPassword: '' })
              .then(refreshedUser => res.status(200).json(refreshedUser))
              .catch(error => res.status(500).json(error));
          } else {
            res.status(500).json(err);
          }
        });
      } else {
        res.status(401).json({ message: 'Спроба скидання паролю вичерпана, спробуйте скидати пароль з самого початку ще раз' });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
};
const sendMail = (req, res, token) => {
  const { email } = req.body;
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: config.mail.smtp.auth.user,
    to: email,
    subject: config.mail.subject,
    html:
      `<div>
      <div>token: <a href="${FURL.base + FURL.remindPassword + token}" style="color:#494ee0">Скинути пароль<a/></div>
      <div>Отправлено с: ${config.mail.smtp.auth.user}</div>
      </div>`,
  };
  // отправляем почту
  transporter.sendMail(mailOptions, (error, info) => {
    // если есть ошибки при отправке - сообщаем об этом
    if (error) {
      return res.status(500).json({ message: `При отправке письма произошла ошибка!: ${error}`, status: 'Error' });
    }
    res.status(200).json({ message: 'Письмо успешно отправлено!', status: 'Ok', token });
  });
};
const tokenForRefreshPass = (req, res) => {
  const { email } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user !== null) {
        const token = authHelper.generateAccessToken(email);
        User.findOneAndUpdate({ email }, { tokenRefreshPassword: token }, { new: true })
          .exec()
          .then(() => {
            sendMail(req, res, token);
          }).catch(err => res.status(500).json({ message: err.message }));
      } else {
        res.status(401).json({ message: 'User with this email dosen`t exist!' });
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
  refreshPass,
  tokenForRefreshPass,
};
