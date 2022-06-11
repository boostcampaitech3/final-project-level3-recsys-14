import styled from "styled-components";
import svgIcon from "./svgIcon";
import { useSelector } from "react-redux";
import { autoUserSearch } from "../modules/autoSearch";
import { RootState } from "../modules";
import { Link, useNavigate } from "react-router-dom";
import { 
  light_purple,
  light_gray,
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
`;

const AutoSearchContainer = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: rgba(255, 255, 255, 0.98);
    border-radius: 5px;
    padding: 0.8rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
`;

const AutoSearchWrap = styled.ul`
    margin: 0; 
    padding: 0;
    font-size: min(max(calc(10px + 1vmin), 8px), 14px);
`;

const AutoSearchData = styled.li`
  width: 100%;
  font-weight: bold;
  letter-spacing: 2px;
  list-style: none;
  border-radius: 5px;
  transition: all .2s linear;
  position: relative;
  .searchicon {
    position: absolute;
    right: 5px;
    width: 36px;
    overflow: overlay;
    top: 18px;
  }
  &:hover {
    background-color: ${light_gray};
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
    fill: ${light_purple};
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
                clip-rule="evenodd"
                viewBox="0 0 28 28"
                strokeWidth="1"
                width="18" height="18">
                <path d="M 32.2664 12.9024 l -8.8992 -8.8992 c -0.8064 -0.8064 -2.1888 -0.8064 -2.9952 0 s -0.8064 2.1888 0 2.9952 l 5.2416 5.2704 h -19.3824 c -1.1808 0 -2.1312 0.9504 -2.1312 2.1312 s 0.9504 2.1312 2.1312 2.1312 h 19.4112 l -5.2704 5.2416 c -0.8064 0.8064 -0.8064 2.1888 0 2.9952 c 0.432 0.432 0.9792 0.6336 1.5264 0.6336 s 1.0944 -0.2016 1.5264 -0.6336 l 8.8416 -8.8416 c 0.4032 -0.4032 0.6336 -0.9504 0.6336 -1.5264 s -0.2016 -1.1232 -0.6336 -1.4976 z"></path>
              </SearchSvgIcon>
              
              </AutoSearchData>
              )
            }): "사용자 검색 결과가 없습니다."}
            
          </AutoSearchWrap>
      </AutoSearchContainer>
  )
}

export default AutoSearch;