const express = require('express');
const multer = require('multer');
const path = require('path');
const fse = require('fs-extra');
const User = require('../../app/controllers/user');
const authMiddleWare = require('../../middleware/auth');

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const upload = path.join('public', 'uploads');
    const folder = path.join(upload, req.params.id);
    fse.exists(folder).then((exist) => {
      if (!exist) {
        fse.mkdir(folder).then(() => {
          cb(null, folder);
        });
      } else {
        fse.emptyDir(folder).then(() => {
          cb(null, folder);
        });
      }
    });
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.params.id}_avatar.${ext}`); // тут можно задавать росширение в ручную, пока все работает но если то задавать примусово.
  },
});


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storageConfig, fileFilter });
const router = express.Router();
router
  .route('/:id')
  .get(
    // authMiddleWare,
    User.getUser,
  )
  .put(User.updateUser);

router.get(
  '/:id/groups',
  // authMiddleWare,
  User.getUserGroups,
);
router.route('/:id/study/:group').get(
  // authMiddleWare,
  User.learningWords,
);
router.route('/:id/study').post(
  // authMiddleWare,
  User.addUserWord,
);
router
  .route('/:id/words')
  .get(
    // authMiddleWare,
    User.getUserWords,
  )
  .delete(User.removeUserWord);
router
  .route('/:id/avatar')
  .get(
    // authMiddleWare,
    User.downloadFile,
  )
  .post(
    // authMiddleWare,
    upload.single('filedata'),
    User.uploadFile,
  );
router.get(
  '/:id/useravatar',
  // authMiddleWare,
  User.getUserAvatar,
);
router.get(
  '/:id/useravatarurl',
  // authMiddleWare,
  User.getUserAvatarUrl,
);

router.get(
  '/',
  // authMiddleWare,
  User.getAllUsers,
);

module.exports = router;
