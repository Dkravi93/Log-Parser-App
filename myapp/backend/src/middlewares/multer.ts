import multer from 'multer';

const multerStore = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/img');
  },
  filename : (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `user-${Date.now()}.${ext}`);
  }
});

export const upload = multer({
 storage : multerStore
});