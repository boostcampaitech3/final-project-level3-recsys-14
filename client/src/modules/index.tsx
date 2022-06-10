import { combineReducers } from "redux";
import userSearchInput from "./userSearchInput";
import problemItem from "./problemItem";
import tagSwitch from "./tagSwitch";
import rivalItem from "./rivalItem";
import rivalProblemItem from "./rivalProblemItem";
import autoSearch from "./autoSearch";
import alertClose from "./alertClose";

const rootReducer = combineReducers({
    userSearchInput,
    problemItem,
    tagSwitch,
    rivalItem,
    rivalProblemItem,
    autoSearch,
    alertClose
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>