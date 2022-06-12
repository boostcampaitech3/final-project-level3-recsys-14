import { Accordion } from "react-bootstrap";
import styled from "styled-components";
import { 
    dark_purple_blue,
    light_pink_white,
    light_purple,
    almost_black,
 } from "../constants/color";

const StyledAccordianButton = styled(Accordion.Button)`
    color: ${almost_black};
    font-weight: 500;

    &:focus {
        border-color: ${light_purple};
        box-shadow: 0 0 0 0.25rem ${light_purple}66;
    }

    &:not(.collapsed) {
        background-color: ${light_pink_white}66;
        color: ${dark_purple_blue};

        
    }

    &::after {
        background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23595959%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e")!important;
    }

`;

const RivalRecFAQ = () => {
    return (
        <Accordion alwaysOpen>
            <Accordion.Item eventKey="0">
                <StyledAccordianButton>
                왜 저는 라이벌 추천이 안되나요?
                </StyledAccordianButton>
                <Accordion.Body>
                라이벌 추천은 유저의 정보와 문제풀이 기록을 기반으로 이루어지므로 
                문제 풀이 기록이 부족하거나 없는 경우 추천이 이뤄질 수 없는 점 양해 부탁드립니다.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <StyledAccordianButton>
                이미 등록한 라이벌이 추천돼요.
                </StyledAccordianButton>
                <Accordion.Body>
                본 서비스 과정에서 추천되는 라이벌은 solved.ac에서 등록한 라이벌과 연동되지 않습니다. 
                개인별 라이벌 정보는 solved.ac의 token을 필요로 하므로 유저별로 어떠한 라이벌이 이미 등록되어 있는지 확인할 수 없습니다.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <StyledAccordianButton>
                라이벌 문제 추천이 일반 문제 추천과 다른 점이 뭔가요?
                </StyledAccordianButton>
                <Accordion.Body>
                라이벌 문제 추천은 자신에게 추천된 라이벌은 풀었지만 자신은 풀지 않은 문제를 최대 30개까지 추천해드리는 서비스입니다. 
                일반 문제 추천에서는 개인의 티어와 문제 풀이 이력을 바탕으로 풀 만한 문제를 추천받을 수 있으며, 
                유저 개개인의 데이터에 따라 두 서비스의 만족도에 차이가 있을 수 있습니다.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
                <StyledAccordianButton>
                라이벌 문제 추천 방법이 궁금해요.
                </StyledAccordianButton>
                <Accordion.Body>
                만일 라이벌은 풀었지만 나는 풀지 않은 문제가 30개 이상이라면 문제 풀이 이력을 기반으로 풀 만한 문제를 우선적으로 추천해줍니다.
                라이벌이 풀었던 문제와 내가 풀었던 문제가 완전히 동일하면 문제 추천이 이뤄지지 않을 수 있습니다.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
                <StyledAccordianButton>
                    이미 이전에 풀었던 문제가 추천돼요.
                </StyledAccordianButton>
                <Accordion.Body>
                    본 웹 서비스는 유저별로 문제를 추천하기 위해 solved.ac에서 데이터를 주기마다 자동으로 가져오고 있으며, 
                    Baekjoon Online Judge 또는 solved.ac의 데이터와 실시간으로 연동되지 않습니다. 
                    이로 인해 다음과 같은 원인으로 추정할 수 있습니다.<br/><br/>
                    1. 데이터를 업데이트 한 시점 이후에 푼 문제인 경우<br/>
                    2. solved.ac API에서 데이터를 제대로 가져오지 못한 경우<br/>
                    3. Baekjoon Online Judge와 solved.ac에서의 문제 푼 기록이 일치하지 않은 상태
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
    
}

export default RivalRecFAQ;