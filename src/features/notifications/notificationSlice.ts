import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from './notificationService';

const initialState = {
  notifications: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  async (_, thunkAPI: any) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notificationService.getNotifications(token);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, thunkAPI: any) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notificationService.markAsRead(id, token);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, thunkAPI: any) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notificationService.markAllAsRead(token);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id: string, thunkAPI: any) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notificationService.deleteNotification(id, token);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n: any) => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index].read = true;
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n: any) => {
          n.read = true;
        });
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n: any) => n._id !== action.payload.id
        );
      });
  },
});

export const { reset } = notificationSlice.actions;
export default notificationSlice.reducer;
