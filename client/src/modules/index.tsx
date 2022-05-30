import { combineReducers } from "redux";
import userSearchInput from "./userSearchInput";
import problemItem from "./problemItem";

const rootReducer = combineReducers({
    userSearchInput,
    problemItem
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>