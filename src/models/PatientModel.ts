import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  email?: string;
  dateOfBirth: Date;
  sex: 'Male' | 'Female' | 'Other';
  history: mongoose.Types.ObjectId[];
  notes?: string;
  // Add more fields as needed...
}

const patientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  email: { type: String },
  dateOfBirth: { type: Date},
  sex: { type: String, enum: ['Male', 'Female', 'Other'] },
  history: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  notes: { type: String },
  // Define more fields...
});

const Patient = mongoose.model<IPatient>('Patient', patientSchema);

export default Patient;
