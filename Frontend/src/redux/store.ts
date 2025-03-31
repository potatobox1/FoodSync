import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import reducers

export const store = configureStore({
  reducer: {
    user: userReducer, // Add slices here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
