import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../modules";
import {toggleSwitch} from "../modules/tagSwitch";

import { TagSwitch } from "../components";
import { useCallback } from "react";

const TagSwitchContainer = () => {
    const dispatch = useDispatch();
    
    const onTagSwitch = useCallback(() => dispatch(toggleSwitch()), [dispatch]);

    return(
        <TagSwitch onTagSwitch = {onTagSwitch} />
    );
};

export default TagSwitchContainer;