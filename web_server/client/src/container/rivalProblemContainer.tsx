import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../modules";
import { rivalProblemToggle } from "../modules/rivalProblemItem";
import {ProblemItem} from "../components";
import styled from "styled-components";


const RivalProblemContatiner = ({item} : any) => {
    const dispatch = useDispatch();
    const problemItem = useSelector((state : RootState) => state.problemItem)

    const onToggle = (item : any) => {
        dispatch(rivalProblemToggle(item));
        // console.log(problemItem)
    };

    return (
        <ProblemItem item={item} onToggle={onToggle} />
    )
}

export default RivalProblemContatiner;