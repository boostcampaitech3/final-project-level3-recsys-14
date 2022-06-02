import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../modules";
import { rivalToggle } from "../modules/rivalItem";
import { RivalItem } from "../components";
import { useCallback } from "react";

const RivalItemContainer = ({rival} :any) => {
    // console.log(rival)
    const dispatch = useDispatch();
    
    const onToggle = useCallback((rival : any) => dispatch(rivalToggle(rival)), [dispatch]);

    return (
        <RivalItem rival = {rival} onToggle = {onToggle} />
    );
};

export default RivalItemContainer;