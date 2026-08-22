import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import propertyReducer from '../features/properties/propertySlice';
import agentReducer from '../features/agent/agentSlice';
import adminReducer from '../features/admin/adminSlice';
import bookingReducer from '../features/bookings/bookingSlice';
import messageReducer from '../features/messages/messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    agent: agentReducer,
    admin: adminReducer,
    bookings: bookingReducer,
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
