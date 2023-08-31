import express from 'express';
import cors from 'cors';
import { connectWithRetry } from './db'; // Correct the import statement
import authRoutes from './routes/AuthRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import taskRoutes from './routes/taskRoutes';
import { setupSwagger } from '../swagger';

const app = express();
const PORT = process.env.PORT || 8000;
const dbURI = process.env.DB_URI || '';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/tasks', taskRoutes);

setupSwagger(app);

connectWithRetry(dbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Export the Express API
module.exports = app;