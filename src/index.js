import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import connectionString from './db/mongoose';
import { applyPassportStrategy } from './utils/passport';
import { errors } from 'celebrate';
const cors = require('cors');
import router from './routes';
import { runCron } from './utils/cron-job';

const app = express();

app.use(cors());
const port = process.env.PORT || 8000;
connectionString();
applyPassportStrategy(passport);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
runCron();

app.use(router);

app.use((req, res) => {
    return res.status(404).json({
        message: 'Resource not found',
        status: false,
    });
});

app.use(errors());

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;
