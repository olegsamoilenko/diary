import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./slices/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
