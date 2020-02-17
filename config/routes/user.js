const express = require('express');
const multer = require('multer');
const path = require('path');
const fse = require('fs-extra');
const auth = require('../../app/controllers/user');
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
router.route('/:id').get(
  // authMiddleWare,
  auth.getUser,
);

router.get(
  '/:id/groups',
  // authMiddleWare,
  auth.getUserGroups,
);
router.route('/:id/study/:group').get(
  // authMiddleWare,
  auth.learningWords,
);
router.route('/:id/study').post(
  // authMiddleWare,
  auth.addUserWord,
);
router.route('/:id/words').get(
  // authMiddleWare,
  auth.getUserWords,
);
router
  .route('/:id/avatar')
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

router.get('/', authMiddleWare, auth.getAllUsers);

module.exports = router;
