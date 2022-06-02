import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../modules";

const ProblemItemPage = styled.div`
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


const ProblemDetail = ({item}:any) =>{
    const tagSwitch = useSelector((state : RootState) => state.tagSwitch.toggle);

    return(
        <>
        <ProblemItemPage>
            <div style={{display : 'flex'}}>
                <h2>{item.title}</h2>
                {tagSwitch && <h4>level : {item.level}</h4>}
            </div>
            {tagSwitch && item.tags.split(',').map((tag : string, i : number) => <div key={i}>{tag}</div>)}
        </ProblemItemPage>
        </>
    )
}

export default ProblemDetail;
