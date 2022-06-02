import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../modules";
import { itemToggle } from "../modules/problemItem";
import {ProblemItem} from "../components";
import styled from "styled-components";


const ProblemItemContatiner = ({item} : any) => {
    const dispatch = useDispatch();
    const problemItem = useSelector((state : RootState) => state.problemItem)

    const onToggle = (item : any) => {
        dispatch(itemToggle(item));
        // console.log(problemItem)
    };

    return (
        <ProblemItem item={item} onToggle={onToggle} />
    )
}

export default ProblemItemContatiner;