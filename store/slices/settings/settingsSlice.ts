import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  aiModel: string;
}

const initialState: SettingsState = {
  aiModel: "gpt-4o",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setAiModel: (state, action: PayloadAction<string>) => {
      state.aiModel = action.payload;
    },
  },
});

export const { setAiModel } = settingsSlice.actions;
export default settingsSlice.reducer;
