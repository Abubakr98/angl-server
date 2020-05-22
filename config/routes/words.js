const express = require('express');
const multer = require('multer');
const path = require('path');
const fse = require('fs-extra');
const words = require('../../app/controllers/words');
const accessAdminMiddleWare = require('../../middleware/isAdmin');
const authMiddleWare = require('../../middleware/auth');

const storageConfigWordImage = multer.diskStorage({
  destination: (req, file, cb) => {
    const upload = path.join('public', 'wordImages');
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
    cb(null, `${req.params.id}_wordImage.${ext}`); // тут можно задавать росширение в ручную, пока все работает но если то задавать примусово.
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
const uploadWordImage = multer({ storage: storageConfigWordImage, fileFilter });
const router = express.Router();
router
  .route('/')
  .get(authMiddleWare, accessAdminMiddleWare, words.getAll)
  .post(
    // authMiddleWare,
    accessAdminMiddleWare,
    words.createOne,
  )
  .delete(
    // authMiddleWare,
    accessAdminMiddleWare,
    words.removeMany,
  );
router.route('/:group').get(
  // authMiddleWare,
  words.getByGroup,
);
router.route('/:id').put(
  // authMiddleWare,
  accessAdminMiddleWare,
  words.updateOne,
);
router
  .route('/:id/images')
  .post(
    // authMiddleWare,
    accessAdminMiddleWare,
    uploadWordImage.single('filedata'),
    words.uploadFile,
  )
  .get(
    // authMiddleWare,
    words.getUserWordImageUrl,
  );
module.exports = router;
