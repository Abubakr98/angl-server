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
      } else if (user.emailVerified) {
        comparePass(password, user.password).then((passMatch) => {
          if (passMatch) {
            updateTokens(user._id)
              .then(tokens => res.json({
                ...tokens,
                userId: user._id,
                id: user.id,
                userEmail: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
              }));
          } else {
            res.status(401).json({ message: 'Invalid credentials!' });
          }
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
      } else {
        res.status(401).json({ message: 'User email does not verified!' });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
};
const emailVerify = (req, res) => {
  const { tokenEmailVerify } = req.params;

  User.findOne({ tokenVerifyEmail: tokenEmailVerify })
    .exec()
    .then((user) => {
      if (user !== null) {
        User.findOneAndUpdate({ tokenVerifyEmail: tokenEmailVerify }, { emailVerified: true, tokenVerifyEmail: '' }, { new: true })
          .then(refreshedUser => res.status(200).json(refreshedUser))
          .catch(error => res.status(500).json(error));
      } else {
        res.status(401).json({ message: 'Спроба скидання паролю вичерпана, спробуйте скидати пароль з самого початку ще раз' });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
};
const sendEmailEmailVerify = (req, res, token) => {
  const { email } = req.body;
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `<${config.mail.smtp.auth.user}>`,
    to: email,
    subject: config.mail.subjectVerifyEmail,
    html:
      `<table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td>
          <div>
            <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${FURL.base + FURL.emailVerify + token}" style="height:36px;v-text-anchor:middle;width:150px;" arcsize="5%" strokecolor="#EB7035" fillcolor="#EB7035">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:Helvetica, Arial,sans-serif;font-size:16px;">Підтвердити пошту &rarr;</center>
              </v:roundrect>
            <![endif]-->
            <a href="${FURL.base + FURL.emailVerify + token}" style="background-color:#EB7035;border:1px solid #EB7035;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">Підтвердити пошту &rarr;</a>
          </div>
        </td>
      </tr>
    </table>
      `,
  };
  // отправляем почту
  transporter.sendMail(mailOptions, (error) => {
    // если есть ошибки при отправке - сообщаем об этом
    if (error) {
      return res.status(500).json({ message: `При отправке письма произошла ошибка!: ${error}`, status: 'Error' });
    }
    res.status(200).json({ message: 'Письмо успешно отправлено!', status: 'Ok', token });
  });
};
const registration = (req, res) => {
  const {
    firstName, lastName, email, password, role,
  } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user === null) {
        crypto.scrypt(password, jwtSecret, 64, (err, hash) => {
          if (err === null) {
            const token = authHelper.generateAccessToken(email);
            User.create({
              firstName,
              lastName,
              email,
              password: hash.toString('hex'),
              tokenVerifyEmail: token,
              role,
            })
              .then((createdUser) => {
                sendEmailEmailVerify(req, res, token);
                res.json(createdUser);
              })
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
  const { tokenPasswordReset } = req.params;

  User.findOne({ tokenRefreshPassword: tokenPasswordReset })
    .exec()
    .then((user) => {
      if (user !== null) {
        crypto.scrypt(password, jwtSecret, 64, (err, hash) => {
          if (err === null) {
            User.findOneAndUpdate({ tokenRefreshPassword: tokenPasswordReset }, { password: hash.toString('hex'), tokenRefreshPassword: '' })//
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
    from: `<${config.mail.smtp.auth.user}>`,
    to: email,
    subject: config.mail.subject,
    html:
      `<table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td>
          <div>
            <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${FURL.base + FURL.remindPassword + token}" style="height:36px;v-text-anchor:middle;width:150px;" arcsize="5%" strokecolor="#EB7035" fillcolor="#EB7035">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:Helvetica, Arial,sans-serif;font-size:16px;">Скинути пароль &rarr;</center>
              </v:roundrect>
            <![endif]-->
            <a href="${FURL.base + FURL.remindPassword + token}" style="background-color:#EB7035;border:1px solid #EB7035;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">Скинути пароль &rarr;</a>
          </div>
        </td>
      </tr>
    </table>
      `,
  };
  // отправляем почту
  transporter.sendMail(mailOptions, (error) => {
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
const pageNotFound = (req, res) => {
  res.status(404).send('404 - страница не найдена!');
};

module.exports = {
  signIn,
  refreshTokens,
  registration,
  refreshPass,
  tokenForRefreshPass,
  emailVerify,
  pageNotFound,
};
