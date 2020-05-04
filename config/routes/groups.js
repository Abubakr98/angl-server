const express = require('express');
const multer = require('multer');
const path = require('path');
const fse = require('fs-extra');
const groups = require('../../app/controllers/groups');
// const authMiddleWare = require('../../middleware/auth');

const storageConfigWordImage = multer.diskStorage({
  destination: (req, file, cb) => {
    const upload = path.join('public', 'groupImages');
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
    cb(null, `${req.params.id}_groupImage.${ext}`); // тут можно задавать росширение в ручную, пока все работает но если что задавать примусово.
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
  .get(
    // authMiddleWare,
    groups.getAllJSon, // getAll
  )
  .post(
    // authMiddleWare,
    groups.createOne,
  )
  .delete(
    // authMiddleWare,
    groups.removeOne,
  );
router
  .route('/:id')
  .get(
    // authMiddleWare,
    groups.getById,
  )
  .put(
    // authMiddleWare,
    groups.updateOne,
  );

router
  .route('/:id/images')
  .post(
    // authMiddleWare,
    uploadWordImage.single('filedata'),
    groups.uploadFile,
  );
module.exports = router;
