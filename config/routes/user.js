const express = require('express');
const multer = require('multer');
const path = require('path');
const fse = require('fs-extra');
const auth = require('../../app/controllers/user');

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
        cb(null, folder);
      }
    });
  },
  filename: (req, file, cb) => {
    // const ext = file.originalname.split('.').pop();
    cb(null, `${req.params.id}_avatar.png`); // тут костыль так как росширение задаеться примусово
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png'
  || file.mimetype === 'image/jpg'
  || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storageConfig, fileFilter });
const router = express.Router();
router.get(
  '/:id',
  // authMiddleWare,
  auth.getUser,
);
router.get(
  '/:id/groups',
  // authMiddleWare,
  auth.getUserGroups,
);
router.get(
  '/:id/words',
  // authMiddleWare,
  auth.getUserWords,
);
router.post(
  '/:id',
  // authMiddleWare,
  auth.addUserWord,
);
router.route('/:id/avatar')
  .get(
    // authMiddleWare,
    auth.downloadFile,
  )
  .post(
  // authMiddleWare,
    upload.single('filedata'),
    auth.uploadFile,
  );
router.get(
  '/:id/useravatar',
  // authMiddleWare,
  auth.getUserAvatar,
);
router.get(
  '/:id/useravatarurl',
  // authMiddleWare,
  auth.getUserAvatarUrl,
);

router.get(
  '/',
  // authMiddleWare,
  auth.getAllUsers,
);

module.exports = router;
