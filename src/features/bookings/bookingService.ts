import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/bookings/` : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/`;

const createBooking = async (bookingData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, bookingData, config);
  return response.data;
};

const getBookings = async (token: string, filters?: any) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: filters
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const getBookingById = async (id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + id, config);
  return response.data;
};

const updateBookingStatus = async (id: string, updateData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + id + '/status', updateData, config);
  return response.data;
};

const deleteBooking = async (id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

const bookingService = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
};

export default bookingService;
