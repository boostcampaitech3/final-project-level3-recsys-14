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

const ProblemRecFAQ = () => {
    return (
        <Accordion alwaysOpen>
            <Accordion.Item eventKey="0">
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
            <Accordion.Item eventKey="1">
                <StyledAccordianButton>
                추천되는 문제가 만족스럽지 못해요.
                </StyledAccordianButton>
                <Accordion.Body>
                문제 추천 서비스는 유저가 푼 문제를 기반으로 여러 딥 러닝 모델을 학습시키고, 
                검증 결과에 따라 미리 정의된 평가 지표 중 가장 결과가 잘 나온 모델을 선택합니다. 
                이후 선택된 모델을 바탕으로 문제 후보를 선정하고 필터링을 통해 최종 문제 추천 결과가 출력됩니다. 
                일부 유저 또는 문제에게 만족스러운 추천 결과를 제공해드릴 수 없는 점 양해 부탁드리며, 
                앞으로 지속하여 모델을 고도화하고 필터링 방법을 수정해 나갈 예정입니다. 
                혹여 문제 추천 결과가 만족스럽지 못할 경우 추후 서비스 발전에 더 큰 도움이 되도록 
                귀하의 서비스 경험에 관한 피드백을 남겨주시면 감사하겠습니다.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <StyledAccordianButton>
                어떠한 딥 러닝 모델을 사용하나요?
                </StyledAccordianButton>
                <Accordion.Body>
                본 서비스는 기본적으로 Autoencoder 기반의 딥 러닝과 머신 러닝 모델을 사용합니다. 
                서비스 개시일 기준(22.06.12) 라이벌 추천에서 사용하는 모델과 다르며, 추후 사용 모델이 변경될 수 있습니다.
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
    
}

export default ProblemRecFAQ;