import styled from "styled-components";
import svgIcon from "./svgIcon";
import { useSelector } from "react-redux";
import { autoUserSearch } from "../modules/autoSearch";
import { RootState } from "../modules";
import { Link, useNavigate } from "react-router-dom";
import { 
  light_purple,
  light_green,
} from "../constants/color";
import tierColor from "../utils/useTierColor";

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

const UserTier = styled.p`
    display: inline-block;
    text-align: center;
    margin: 10px 12px 10px 5px;   
    border-radius: 100px;
    padding: 4px 8px;
    /* color: #13854e; */
    /* background-color: #d6ede2; */
`;

const AutoSearchContainer = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    z-index: 100;
    font-size: 1rem;
    background-color: rgba(255, 255, 255, 0.98);
    border-radius: 5px;
    padding: 0.8rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
`;

const AutoSearchWrap = styled.ul`
    margin: 0; 
    padding: 0;
`;

const AutoSearchData = styled.li`
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
  list-style: none;
  border-radius: 5px;
  transition: all .2s linear;
  position: relative;
  .searchicon {
    position: absolute;
    right: 5px;
    width: 18px;
    overflow: overlay;
    top: 50%;
    transform: 
      translateY(-50%)
      rotate(-90deg);
  }
  &:hover {
    background-color: ${light_green};
    cursor: pointer;
  }
`;

const SearchResult = styled(Link)`
    color: #595959;
    text-decoration: none;
`;

const SearchSvgIcon = styled(svgIcon)` 
    width: min(max(calc(10px + 1vmin), 10px), 18px); 
    height: min(max(calc(10px + 1vmin), 10px), 18px);
    stroke: ${light_purple};
`;

const AutoSearch = ({selectedMenu} : any) =>{
  const navigate = useNavigate();
  const searchHandles = useSelector((state : RootState)=> state.autoSearch.handles);

  const onClickUser = (userId : string) => {
    if (selectedMenu == 'problem'){
      navigate(`/user/${userId}`);
    }
    else {
      navigate(`/user/${userId}/rival`);
    }
  }

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
            {searchHandles.length > 0 ? searchHandles.map((user : any, i : number) => {
              return(
              <AutoSearchData key = {i} onClick= {() => onClickUser(user.handle)}>
              
              <UserTier style={{color : tierColor(tierScaling(user.tier))[0], backgroundColor : tierColor(tierScaling(user.tier))[1]}}>
                {tierScaling(user.tier)}
                </UserTier>
              {user.handle}

              <SearchSvgIcon className="searchicon"
                fill-rule="evenodd" 
                fill= "#fff"
                clip-rule="evenodd"
                viewBox="0 0 28 28"
                strokeWidth="2"
                width="18" height="18">
                <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm5.247 8l-5.247 6.44-5.263-6.44-.737.678 6 7.322 6-7.335-.753-.665z"/>
              </SearchSvgIcon>
              
              </AutoSearchData>
              )
            }): "사용자 검색 결과가 없습니다."}
            
          </AutoSearchWrap>
      </AutoSearchContainer>
  )
}

export default AutoSearch;