import mongoose, { Schema, Document } from 'mongoose';

export enum AppointmentStatus {
  Done = 'Done',
  Pending = 'Pending',
  Missed = 'Missed',
}

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  startTime: Date;
  duration: number; // in minutes
  reason: string;
  createdAt: Date;
  status: AppointmentStatus;
  // Add more fields as needed...
}

const appointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.Pending },
  // Define more fields...
});

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;
