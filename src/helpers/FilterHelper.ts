import { AppointmentStatus } from '../models/AppointmentModel';

export const buildDateFilter = (date: string) => {
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);
  return { $gte: startDate, $lt: endDate };
};

export const buildStatusFilter = (status: string) => {
  if (Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
    return status;
  }
  return null;
};
