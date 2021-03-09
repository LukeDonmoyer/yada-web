import {
  createAction,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { User, UserCollection } from "./FirestoreInterfaces";

export const updateUsers_action = createAction('updateUsers');

const updateUsersSlice = createSlice<
  UserCollection,
  SliceCaseReducers<UserCollection>
>({
  name: "users",
  initialState: {},
  reducers: {
    updateUsers(state, action: PayloadAction<UserCollection>) {
      return action.payload;
    },
  }
});

export const { updateUsers } = updateUsersSlice.actions;
export default updateUsersSlice;
