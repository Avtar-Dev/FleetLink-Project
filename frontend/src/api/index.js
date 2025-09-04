import axios from "axios";
const base = "http://localhost:3000/api";

export const createVehicle = (payload) =>
  axios.post(`${base}/vehicles`, payload);
export const searchAvailable = (params) =>
  axios.get(`${base}/vehicles/available`, { params });
export const createBooking = (payload) =>
  axios.post(`${base}/bookings`, payload);
