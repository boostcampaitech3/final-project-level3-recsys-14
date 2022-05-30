import styled from "styled-components";
import TagSwitch from './TagSwitch';

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
    return(
        <>
        <TagSwitch />
        <ProblemItemPage>
            <div style={{display : 'flex'}}>
                <h2>{item.title}</h2>
                <h4>level : {item.level}</h4>
            </div>
            {item.tags.split(',').map((tag : string, i : number) => <div key={i}>{tag}</div>)}
        </ProblemItemPage>
        </>
    )
}

export default ProblemDetail;
