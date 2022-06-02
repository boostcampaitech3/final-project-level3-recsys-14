import styled from "styled-components";

const AutoSearchContainer = styled.div`
  z-index: 3;
  height: 50vh;
  width: 400px;
  background-color: #fff;
  position: absolute;
  top: 45px;
  border: 2px solid;
  padding: 15px;
`;

const AutoSearchWrap = styled.ul`

`;

const AutoSearchData = styled.li`
  padding: 10px 8px;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  z-index: 4;
  letter-spacing: 2px;
  &:hover {
    background-color: #edf5f5;
    cursor: pointer;
  }
  position: relative;
  img {
    position: absolute;
    right: 5px;
    width: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const AutoSearch = () =>{
    return (
        <AutoSearchContainer>
            <AutoSearchWrap>
                <AutoSearchData>
                    <a href="#"></a>
                </AutoSearchData>
            </AutoSearchWrap>
        </AutoSearchContainer>
    )
}
export default AutoSearch;