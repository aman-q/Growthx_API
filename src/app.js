import express from 'express';
import bodyParser from 'body-parser';
import route from './routes/index.js';
import connectDb from './config/db.js';

const app= express();
app.use(bodyParser.json());
connectDb();

app.get('/',(req,res)=>{
    res.send('Growthx Backend is Running');
});

app.use('/api',route);

export default app;
