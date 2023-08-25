import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const dbURI = process.env.DB_URI || '';

mongoose.connect(dbURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

export default db;
