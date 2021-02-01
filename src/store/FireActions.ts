import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const login_action = createAction("login");
export const logout_action = createAction("logout");

export interface userState {
  currentUser: any;
}
const initialState = {
  currentUser: null,
} as userState;

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login(state, action: PayloadAction<any>) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
