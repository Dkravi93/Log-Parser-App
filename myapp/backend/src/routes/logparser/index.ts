import { Router } from 'express';
import {upload} from '../../middlewares/multer';
const router = Router();

const logLevels = ['error', 'warn'];
import { readFileSync } from 'fs';

router.post('/',upload.single("File"), (req, res) => {
    const  file  = req.file;
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

export default router;