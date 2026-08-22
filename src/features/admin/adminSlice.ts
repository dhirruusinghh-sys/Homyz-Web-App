import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/admin/` : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/`;
const axiosInstance = axios.create({ withCredentials: true });

interface AdminState {
  users: any[];
  agents: any[];
  properties: any[];
  categories: any[];
  amenities: any[];
  cities: any[];
  bookings: any[];
  messages: any[];
  blogs: any[];
  newsletters: any[];
  overview: any;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: AdminState = {
  users: [],
  agents: [],
  properties: [],
  categories: [],
  amenities: [],
  cities: [],
  bookings: [],
  messages: [],
  blogs: [],
  newsletters: [],
  overview: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getAdminOverview = createAsyncThunk('admin/getOverview', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'overview');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getUsers = createAsyncThunk('admin/getUsers', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'users');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateUserStatus = createAsyncThunk('admin/updateUserStatus', async (data: { id: string, status: string }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`${API_URL}users/${data.id}/status`, { status: data.status });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getAgents = createAsyncThunk('admin/getAgents', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'agents');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateAgentStatus = createAsyncThunk('admin/updateAgentStatus', async (data: { id: string, agentStatus: string }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`${API_URL}agents/${data.id}/status`, { agentStatus: data.agentStatus });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getAdminProperties = createAsyncThunk('admin/getProperties', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'properties');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateAdminPropertyStatus = createAsyncThunk('admin/updatePropertyStatus', async (data: { id: string, status: string }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`${API_URL}properties/${data.id}/status`, { status: data.status });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Categories
export const getCategories = createAsyncThunk('admin/getCategories', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'categories');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const createCategory = createAsyncThunk('admin/createCategory', async (data: any, thunkAPI) => {
  try {
    const response = await axiosInstance.post(API_URL + 'categories', data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || error.toString());
  }
});
export const deleteCategory = createAsyncThunk('admin/deleteCategory', async (id: string, thunkAPI) => {
  try {
    await axiosInstance.delete(API_URL + 'categories/' + id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || error.toString());
  }
});

// Amenities
export const getAmenities = createAsyncThunk('admin/getAmenities', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'amenities');
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || error.toString());
  }
});
export const createAmenity = createAsyncThunk('admin/createAmenity', async (data: any, thunkAPI) => {
  try {
    const response = await axiosInstance.post(API_URL + 'amenities', data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || error.toString());
  }
});
export const deleteAmenity = createAsyncThunk('admin/deleteAmenity', async (id: string, thunkAPI) => {
  try {
    await axiosInstance.delete(API_URL + 'amenities/' + id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || error.toString());
  }
});

// Cities
export const getCities = createAsyncThunk('admin/getCities', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'cities');
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || error.toString());
  }
});
export const createCity = createAsyncThunk('admin/createCity', async (data: any, thunkAPI) => {
  try {
    const response = await axiosInstance.post(API_URL + 'cities', data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || error.toString());
  }
});
export const deleteCity = createAsyncThunk('admin/deleteCity', async (id: string, thunkAPI) => {
  try {
    await axiosInstance.delete(API_URL + 'cities/' + id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || error.toString());
  }
});

// Phase 3
export const getAdminBookings = createAsyncThunk('admin/getBookings', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'bookings');
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});
export const getAdminMessages = createAsyncThunk('admin/getMessages', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'messages');
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

// Blogs
export const getBlogs = createAsyncThunk('admin/getBlogs', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'blogs');
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});
export const createBlog = createAsyncThunk('admin/createBlog', async (data: any, thunkAPI) => {
  try {
    const response = await axiosInstance.post(API_URL + 'blogs', data);
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});
export const deleteBlog = createAsyncThunk('admin/deleteBlog', async (id: string, thunkAPI) => {
  try {
    await axiosInstance.delete(API_URL + 'blogs/' + id);
    return id;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

// Newsletters
export const getNewsletters = createAsyncThunk('admin/getNewsletters', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(API_URL + 'newsletters');
    return response.data;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});
export const deleteNewsletter = createAsyncThunk('admin/deleteNewsletter', async (id: string, thunkAPI) => {
  try {
    await axiosInstance.delete(API_URL + 'newsletters/' + id);
    return id;
  } catch (error: any) { return thunkAPI.rejectWithValue(error.message); }
});

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminOverview.pending, (state) => { state.isLoading = true; })
      .addCase(getAdminOverview.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.overview = action.payload;
      })
      .addCase(getAdminOverview.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      
      .addCase(getUsers.pending, (state) => { state.isLoading = true; })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })

      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) { state.users[index] = action.payload; }
      })

      .addCase(getAgents.pending, (state) => { state.isLoading = true; })
      .addCase(getAgents.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.agents = action.payload;
      })
      .addCase(getAgents.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })

      .addCase(updateAgentStatus.fulfilled, (state, action) => {
        const index = state.agents.findIndex(a => a._id === action.payload._id);
        if (index !== -1) { state.agents[index] = action.payload; }
      })
      
      // Properties
      .addCase(getAdminProperties.fulfilled, (state, action) => {
        state.properties = action.payload;
      })
      .addCase(updateAdminPropertyStatus.fulfilled, (state, action) => {
        const index = state.properties.findIndex(p => p._id === action.payload._id);
        if (index !== -1) { state.properties[index] = action.payload; }
      })

      // Categories
      .addCase(getCategories.fulfilled, (state, action) => { state.categories = action.payload; })
      .addCase(createCategory.fulfilled, (state, action) => { state.categories.push(action.payload); })
      .addCase(deleteCategory.fulfilled, (state, action) => { state.categories = state.categories.filter(c => c._id !== action.payload); })
      
      // Amenities
      .addCase(getAmenities.fulfilled, (state, action) => { state.amenities = action.payload; })
      .addCase(createAmenity.fulfilled, (state, action) => { state.amenities.push(action.payload); })
      .addCase(deleteAmenity.fulfilled, (state, action) => { state.amenities = state.amenities.filter(a => a._id !== action.payload); })

      // Cities
      .addCase(getCities.fulfilled, (state, action) => { state.cities = action.payload; })
      .addCase(createCity.fulfilled, (state, action) => { state.cities.push(action.payload); })
      .addCase(deleteCity.fulfilled, (state, action) => { state.cities = state.cities.filter(c => c._id !== action.payload); })

      // Phase 3
      .addCase(getAdminBookings.fulfilled, (state, action) => { state.bookings = action.payload; })
      .addCase(getAdminMessages.fulfilled, (state, action) => { state.messages = action.payload; })
      
      .addCase(getBlogs.fulfilled, (state, action) => { state.blogs = action.payload; })
      .addCase(createBlog.fulfilled, (state, action) => { state.blogs.push(action.payload); })
      .addCase(deleteBlog.fulfilled, (state, action) => { state.blogs = state.blogs.filter(b => b._id !== action.payload); })

      .addCase(getNewsletters.fulfilled, (state, action) => { state.newsletters = action.payload; })
      .addCase(deleteNewsletter.fulfilled, (state, action) => { state.newsletters = state.newsletters.filter(n => n._id !== action.payload); });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
