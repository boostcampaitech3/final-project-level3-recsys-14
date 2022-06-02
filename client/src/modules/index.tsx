import { combineReducers } from "redux";
import userSearchInput from "./userSearchInput";
import problemItem from "./problemItem";
import tagSwitch from "./tagSwitch";
import rivalItem from "./rivalItem";

const rootReducer = combineReducers({
    userSearchInput,
    problemItem,
    tagSwitch,
    rivalItem
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>