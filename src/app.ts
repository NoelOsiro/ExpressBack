// app.ts
import express from 'express';
import cors from 'cors';
import db from './db';
import authRoutes from './routes/AuthRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import taskRoutes from './routes/taskRoutes';
import { setupSwagger } from '../swagger';

export const app = express();
const PORT = process.env.PORT || 8000;

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
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
