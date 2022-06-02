import styled from "styled-components";
import { 
    light_gray,
    dawn_gray,
} from "../constants/color";

const FooterWrapper = styled.div`
    width: 100%;
    height: 120px;
    background-color: ${light_gray};
`;

const Footer = styled.div`
    width: 100%;
    margin: auto;
    max-width: 1200px;
    padding: 42px 20px;
    font-size: 0.8rem;
    color: ${dawn_gray};
`;

const MainFooter = () => {
    return (
        <FooterWrapper>
            <Footer>
                    본 웹사이트는 Baekjoon Online Judge 또는 solved.ac와 관련이 없으며, 비영리로 운영되는 팀 프로젝트의 결과물입니다.
            </Footer>
        </FooterWrapper>
    )
};

export default MainFooter;