import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../modules";

const RivalItemPage = styled.div`
position: relative;
background: white;
border-radius: 16px;
box-shadow: 0 0 8px 0 rgba(0,0,0,0.04);

margin: 0 auto;

cursor: pointer;
&:hover {
    color: #6b6eff;
  }
`;


const RivalDetail = ({rival}:any) =>{
    // const tagSwitch = useSelector((state : RootState) => state.tagSwitch.toggle);

    return(
        <>
        <RivalItemPage>
            <div style={{display : 'flex'}}>
                <h2>{rival.handle}</h2>
                <h4>Tier : {rival.tier}</h4>
                <h4>Class : {rival.user_class}</h4>
            </div>
            <div>The Number of Solved : {rival.solved_count}</div>
            <div>Rating : {rival.rating}</div>
            <div>Exp : {rival.exp}</div>
            <div>Rank : {rival.rank}</div>
            {/* {tagSwitch && item.tags.split(',').map((tag : string, i : number) => <div key={i}>{tag}</div>)} */}
        </RivalItemPage>
        </>
    )
}

export default RivalDetail;
