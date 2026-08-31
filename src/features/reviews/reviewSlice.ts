import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from './reviewService';
import type { RootState } from '../../app/store';

export interface ReviewState {
  reviews: any[];
  propertyReviews: any[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: ReviewState = {
  reviews: [],
  propertyReviews: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createReview = createAsyncThunk(
  'reviews/create',
  async (reviewData: any, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.user?.token;
      return await reviewService.createReview(reviewData, token);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCustomerReviews = createAsyncThunk(
  'reviews/getCustomer',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.user?.token;
      return await reviewService.getCustomerReviews(token);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPropertyReviews = createAsyncThunk(
  'reviews/getProperty',
  async (propertyId: string, thunkAPI) => {
    try {
      return await reviewService.getPropertyReviews(propertyId);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (id: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.user?.token;
      return await reviewService.deleteReview(id, token);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews.unshift(action.payload); // Add to customer reviews
        state.propertyReviews.unshift(action.payload); // Add to property reviews
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getCustomerReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCustomerReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews = action.payload;
      })
      .addCase(getCustomerReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getPropertyReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPropertyReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.propertyReviews = action.payload;
      })
      .addCase(getPropertyReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews = state.reviews.filter(r => r._id !== action.payload.id);
        state.propertyReviews = state.propertyReviews.filter(r => r._id !== action.payload.id);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer;
