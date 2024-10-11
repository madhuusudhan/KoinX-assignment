import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coin from './coinModel.js';
import fetchData from './utils/job.js';
import {CronJob} from 'cron';
import fetchStats from './utils/fetchStats.js';
import fetchDeviation from './utils/fetchDeviation.js';
dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

  fetchData();
  const job = new CronJob(
    '* */2 * * *',
    async function () {
      console.log('Fetching cryptocurrency data every 2 hours');
      await fetchData();
    },
    null,
    true,
    'Asia/Kolkata'
  ); 
app.get("/stats",fetchStats);
app.get("/deviation", fetchDeviation);

app.listen(3000, () => {
    console.log("listening on port 3000");
});
