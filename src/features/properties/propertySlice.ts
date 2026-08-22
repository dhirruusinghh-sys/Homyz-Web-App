import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import propertyService from './propertyService';

interface PropertyState {
  properties: any[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  singleProperty?: any | null;
}

const initialState: PropertyState = {
  properties: [],
  singleProperty: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all properties (public)
export const getProperties = createAsyncThunk(
  'properties/getAll',
  async (queryString: string = '', thunkAPI) => {
    try {
      return await propertyService.getProperties(queryString);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get property by id
export const getPropertyById = createAsyncThunk(
  'properties/getById',
  async (id: string, thunkAPI) => {
    try {
      return await propertyService.getPropertyById(id);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get agent properties
export const getAgentProperties = createAsyncThunk(
  'properties/getAgentProperties',
  async (_, thunkAPI) => {
    try {
      return await propertyService.getAgentProperties();
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create property
export const createProperty = createAsyncThunk(
  'properties/create',
  async (propertyData: FormData, thunkAPI) => {
    try {
      return await propertyService.createProperty(propertyData);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Update property
export const updateProperty = createAsyncThunk(
  'properties/update',
  async (data: { id: string, propertyData: FormData }, thunkAPI) => {
    try {
      return await propertyService.updateProperty(data.id, data.propertyData);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Delete property
export const deleteProperty = createAsyncThunk(
  'properties/delete',
  async (id: string, thunkAPI) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Depending on backend returning { properties, page, pages }
        state.properties = action.payload.properties || action.payload; 
      })
      .addCase(getProperties.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPropertyById.pending, (state) => {
        state.isLoading = true;
        state.singleProperty = null;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleProperty = action.payload;
      })
      .addCase(getPropertyById.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAgentProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgentProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload;
      })
      .addCase(getAgentProperties.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties.push(action.payload);
      })
      .addCase(createProperty.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.properties.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        if (state.singleProperty?._id === action.payload._id) {
           state.singleProperty = action.payload;
        }
      })
      .addCase(updateProperty.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = state.properties.filter(
          (property) => property._id !== action.payload
        );
      })
      .addCase(deleteProperty.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;
