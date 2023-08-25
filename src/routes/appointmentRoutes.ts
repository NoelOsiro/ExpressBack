import express from 'express';
import Appointment from '../models/AppointmentModel';
import { buildDateFilter, buildStatusFilter } from '../helpers/FilterHelper';

const router = express.Router();

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     requestBody:
 *       description: Appointment details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Created appointment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: An error occurred
 */
router.post('/', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get a list of appointments
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: An error occurred
 */
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: An error occurred
 */
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     requestBody:
 *       description: Updated appointment details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Updated appointment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: An error occurred
 */
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       204:
 *         description: Appointment deleted
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: An error occurred
 */
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * @swagger
 * /appointments/filter:
 *   get:
 *     summary: Filter appointments by date and/or status
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Appointment date (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Appointment status
 *     responses:
 *       200:
 *         description: Filtered appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: An error occurred
 */
router.get('/filter', async (req, res) => {
  try {
    const { date, status } = req.query;
    const filters: any = {};

    if (date) {
      filters.date = buildDateFilter(date as string);
    }

    const statusFilter = buildStatusFilter(status as string);
    if (statusFilter !== null) {
      filters.status = statusFilter;
    }

    const filteredAppointments = await Appointment.find(filters);

    res.status(200).json(filteredAppointments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
