import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  Doctor = 'Doctor',
  Nurse = 'Nurse',
  Receptionist = 'Receptionist',
  NurseAid = 'Nurse Aid',
  OfficeAssistant = 'Office Assistant',
}

export interface IUser extends Document {
  firstName:string;
  lastName:string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  sex: 'Male' | 'Female' | 'Other';
  role: UserRole;
  verified: Boolean,
  verificationToken: String | undefined,
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  sex: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  verified: {type: Boolean, required:true},
  verificationToken: { type: String },
});

// Hash the password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});
// Method to compare password
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
