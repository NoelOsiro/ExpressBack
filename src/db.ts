import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const connectWithRetry = (uri:string) => {
  return mongoose.connect(uri);
};

export { connectWithRetry };
