import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import './db/mongoose';
import { errors } from 'celebrate';
const cors = require('cors');
import router from './routes';

const app = express();

app.use(cors());
const port = process.env.PORT;
//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use Routes

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
