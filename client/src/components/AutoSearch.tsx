import styled from "styled-components";
import svgIcon from "./svgIcon";
import { useSelector } from "react-redux";
import { autoUserSearch } from "../modules/autoSearch";
import { RootState } from "../modules";
import { Link, useNavigate } from "react-router-dom";

const WhiteTierBox = styled.div`
    display: inline-block;
    width: 29%;
    height: 100%;
    margin: 0 1%;
    @media screen and (max-width: 640px){
        display: flex;
        justify-content: center;
        width: 100%;
        margin-left: 0;
    }
`;

const UserTier = styled.h4`
    text-align: center;
    margin: 10px 1%;    
    border-radius: 100px;
    padding: 4px 8px;
    font-size: 1.3rem;
    color: #13854e;
    background-color: #d6ede2;
    @media screen and (max-width: 640px){
        width: 70%;
    }
`;

const AutoSearchContainer = styled.div`
  /* z-index: 3; */
  height: 50vh;
  width: 400px;
  background-color: #fff;
  /* position: absolute; */
  /* top: 45px; */
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
  /* z-index: 4; */
  letter-spacing: 2px;
  &:hover {
    background-color: #edf5f5;
    cursor: pointer;
  }
  position: relative;
  .searchicon {
    position: absolute;
    right: 5px;
    width: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const SearchSvgIcon = styled(svgIcon)` 
    width: min(max(calc(10px + 1vmin), 10px), 18px); 
    height: min(max(calc(10px + 1vmin), 10px), 18px);
`;

const AutoSearch = () =>{
  const navigate = useNavigate();
  const searchHandles = useSelector((state : RootState)=> state.autoSearch.handles);


  const tierScaling = (tier : number) => {
  let scaledTier = "티어 정보 없음";

    if (tier > 0){
      switch(Math.floor((tier - 1) / 5)){
          case 0:
            scaledTier = "브론즈"; 
              break;
          case 1: 
          scaledTier = "실버";
              break;
          case 2:
            scaledTier = "골드";
              break;
          case 3:
            scaledTier = "플래티넘";
              break;
          case 4:
            scaledTier = "다이아몬드";
              break;
          case 5:
            scaledTier = "루비";
              break;
          default:
            scaledTier = "마스터"
              break;
      } 
      if (scaledTier != "마스터"){
        scaledTier = scaledTier + " " + (6 - ((tier - 1) % 5 + 1));
      }
    }
    return (scaledTier);
  }

  return (
      <AutoSearchContainer>
          <AutoSearchWrap>
            {searchHandles.map((user : any, i : number) => {
              return(
              <AutoSearchData key = {i} onClick= {() => navigate(`/user/${user.handle}`)}>
              <Link to={`/user/${user.handle}`}>
                <UserTier>
                {tierScaling(user.tier)}
                </UserTier>
                {user.handle}</Link>
              <SearchSvgIcon className="searchicon"
                fill='none'
                stroke='currentColor'
                viewBox="0 0 28 28"
                strokeWidth="3">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </SearchSvgIcon>
            </AutoSearchData>
              )
            })}
            
          </AutoSearchWrap>
      </AutoSearchContainer>
  )
}
export default AutoSearch;