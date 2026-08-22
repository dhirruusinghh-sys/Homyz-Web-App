import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/properties/` : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties/`;

const axiosInstance = axios.create({
  withCredentials: true
});

// Get all properties (public, with filters)
const getProperties = async (queryString: string = '') => {
  const response = await axiosInstance.get(API_URL + '?' + queryString);
  return response.data;
};

// Get property by ID
const getPropertyById = async (propertyId: string) => {
  const response = await axiosInstance.get(API_URL + propertyId);
  return response.data;
};

// Get agent properties
const getAgentProperties = async () => {
  const response = await axiosInstance.get(API_URL + 'agent');
  return response.data;
};

// Create property
const createProperty = async (propertyData: FormData) => {
  const response = await axiosInstance.post(API_URL, propertyData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update property
const updateProperty = async (propertyId: string, propertyData: FormData) => {
  const response = await axiosInstance.put(API_URL + propertyId, propertyData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete property
const deleteProperty = async (propertyId: string) => {
  const response = await axiosInstance.delete(API_URL + propertyId);
  return response.data;
};

const propertyService = {
  getProperties,
  getPropertyById,
  getAgentProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};

export default propertyService;
