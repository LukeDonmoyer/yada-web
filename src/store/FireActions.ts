/**
 * Redux management for firestore data
 */

import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserPrivilege } from "scripts/FireConfig";

export const login_action = createAction("login");
export const logout_action = createAction("logout");

// userUID starts as null, firestore objects without authentication are undefined
export interface userUID {
  userUID: string | null | undefined;
}
const initialState = {
  userUID: null,
} as userUID;

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string | undefined>) {
      state.userUID = action.payload;
    },
    logout(state) {
      state.userUID = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
