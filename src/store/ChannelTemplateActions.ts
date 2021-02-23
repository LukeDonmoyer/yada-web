import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const updateChannelTemplates_action = createAction(
  "updateChannelTemplates"
);

const initialState = {
  templates: {},
};

const updateChannelTemplatesSlice = createSlice({
  name: "updateChannelTemplates",
  initialState,
  reducers: {
    updateChannelTemplates(state, action: PayloadAction<any>) {
      state.templates = action.payload;
    },
  },
});

export const { updateChannelTemplates } = updateChannelTemplatesSlice.actions;
export default updateChannelTemplatesSlice;
