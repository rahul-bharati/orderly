import express from 'express';
import cors from 'cors';
import helmet from "helmet";
// @ts-ignore
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('combined'));
app.use(helmet());

app.get('/', (req, res) => {
    res.send({message: 'Hello World!'});
});

app.all('*', (req, res) => {
    res.status(404).send({message: 'Route not found'});
})

export default app;