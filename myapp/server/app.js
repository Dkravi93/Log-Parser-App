const express = require('express');
const createError = require('http-errors');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}));
const morgan = require('morgan');
const { readFileSync } = require('fs');
require('dotenv').config();

const logLevels = ['error', 'warn'];

app.use(express.json());
const multer = require('multer');

const multerStore = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/img');        
  },
  filename : (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `user-${Date.now()}.${ext}`);
  }
});

const upload = multer({
 storage : multerStore
});
app.get('/', (req, res) => {
  res.send({message: 'Happy coding'});
})

app.post('/api/parse-logs', upload.single("File"), (req, res) => {
  const  file  = req.file;
  console.log(file)
  const logs = readFileSync(file.path, 'utf-8')
    .split('\n')
    .filter(log => logLevels.some(level => log.includes(level)))
    .map(log => {
      const [date, level, ...json] = log.split(' - ');
      return {
        date,
        level,
        ...JSON.parse(json.join(' - '))
      };
    });
  res.json({ logs });
});



app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
