import { combineReducers } from "redux";
import userSearchInput from "./userSearchInput";

const rootReducer = combineReducers({
    userSearchInput
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>