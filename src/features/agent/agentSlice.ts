import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/`;
const axiosInstance = axios.create({ withCredentials: true });

interface AgentState {
  requests: any[];
  properties: any[];
  bookings: any[];
  messages: any[];
  overview: any;
  analytics: any;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: AgentState = {
  requests: [],
  properties: [],
  bookings: [],
  messages: [],
  overview: null,
  analytics: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getAgentRequests = createAsyncThunk(
  'agent/getRequests',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(API_URL + 'agent');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'agent/updateRequestStatus',
  async (data: { id: string, status: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`${API_URL}${data.id}/status`, { status: data.status });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Agent Dashboard Endpoints
export const getAgentOverview = createAsyncThunk('agent/getOverview', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/overview`);
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const getAgentProperties = createAsyncThunk('agent/getProperties', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties/agent`);
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const createProperty = createAsyncThunk('agent/createProperty', async (data: any, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties`, data);
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const updateProperty = createAsyncThunk('agent/updateProperty', async (data: { id: string, formData: any }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties/${data.id}`, data.formData);
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const deleteProperty = createAsyncThunk('agent/deleteProperty', async (id: string, thunkAPI) => {
  try {
    await axiosInstance.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties/${id}`);
    return id;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const getAgentBookings = createAsyncThunk('agent/getBookings', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/bookings`);
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const updateBookingStatus = createAsyncThunk('agent/updateBookingStatus', async (data: { id: string, status: string }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/bookings/${data.id}/status`, { status: data.status });
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const getAgentMessages = createAsyncThunk('agent/getMessages', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/messages`);
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const getAgentAnalytics = createAsyncThunk('agent/getAnalytics', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/analytics`);
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAgentRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgentRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.requests = action.payload;
      })
      .addCase(getAgentRequests.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex(req => req._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      
      .addCase(getAgentOverview.fulfilled, (state, action) => { state.overview = action.payload; })
      .addCase(getAgentProperties.fulfilled, (state, action) => { state.properties = action.payload; })
      .addCase(createProperty.fulfilled, (state, action) => { state.properties.push(action.payload); })
      .addCase(updateProperty.fulfilled, (state, action) => {
        const index = state.properties.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.properties[index] = action.payload;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(p => p._id !== action.payload);
      })
      .addCase(getAgentBookings.fulfilled, (state, action) => { state.bookings = action.payload; })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) state.bookings[index] = action.payload;
      })
      .addCase(getAgentMessages.fulfilled, (state, action) => { state.messages = action.payload; })
      .addCase(getAgentAnalytics.fulfilled, (state, action) => { state.analytics = action.payload; });
  },
});

export const { reset } = agentSlice.actions;
export default agentSlice.reducer;
