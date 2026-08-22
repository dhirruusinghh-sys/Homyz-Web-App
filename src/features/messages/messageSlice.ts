import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/messages/` : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages/`;
const axiosInstance = axios.create({ withCredentials: true });

interface MessageState {
  messages: any[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: MessageState = {
  messages: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchMessages = createAsyncThunk('messages/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const sendMessage = createAsyncThunk('messages/send', async (data: { receiverId: string, content: string }, thunkAPI) => {
  try {
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<any>) => {
      // Check if message already exists to avoid duplicates
      const exists = state.messages.find(m => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;
