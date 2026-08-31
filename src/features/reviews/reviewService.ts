import axios from 'axios';

const API_URL = '/api/reviews/';

// Create new review
const createReview = async (reviewData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, reviewData, config);
  return response.data;
};

// Get customer reviews
const getCustomerReviews = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'customer', config);
  return response.data;
};

// Get property reviews
const getPropertyReviews = async (propertyId: string) => {
  const response = await axios.get(API_URL + 'property/' + propertyId);
  return response.data;
};

// Delete review
const deleteReview = async (id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

const reviewService = {
  createReview,
  getCustomerReviews,
  getPropertyReviews,
  deleteReview,
};

export default reviewService;
