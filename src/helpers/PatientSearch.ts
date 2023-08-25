import { FilterQuery } from 'mongoose';
import Patient from '../models/PatientModel';

export const buildPatientSearchQuery = (query: string): FilterQuery<typeof Patient> => {
  return {
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } },
    ],
  };
};
