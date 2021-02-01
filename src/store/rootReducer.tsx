import authSlice from "./FireActions";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

export default rootReducer;
