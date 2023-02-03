import Express from "express";
import cors from "cors";
// Use global variables

// Setup express

const app = Express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

import apiRoutes from './routes';
app.use('/api', apiRoutes);



app.get('/ping', function (req: Express.Request, res: Express.Response) {
    console.log(`${new Date().toISOString()}: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    res.json({ Pong: new Date() });
});

app.listen(3001, () => console.log('Listening on port 3001! Try http://localhost:3001/ping'));
