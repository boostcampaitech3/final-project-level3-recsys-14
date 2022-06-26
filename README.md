# **나를 위한 알고리즘 문제와 라이벌 추천, RECJOON**



![RECJOON Logo](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655085908.png)

## Baekjoon Online Judge 문제 추천과 solved.ac 라이벌 추천 서비스

딥 러닝과 머신 러닝을 사용하여 BOJ(Baekjoon Online Judge)와 solved.ac 유저의 개인별 문제 풀이 이력을 바탕으로 본인의 수준에 맞는 문제와 라이벌을 추천하는 AI 모델 기반 서비스입니다.

![RECJOON Computers](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655087579.png)

🖥 **[웹 사이트 보러 가기](http://recjoon.com)**

**※ 본 웹 서비스는 베타 버전이며 <u>2022년 7월 31일까지</u> 한시적으로 운영될 예정입니다.**

<img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=PyTorch&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Apache_Airflow-018CEE?style=flat-square&logo=Apache Airflow&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Express-20c997?style=flat-square&logo=Express&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/React-0088cc?style=flat-square&logo=React&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Amazon_AWS-232F3E?style=flat-square&logo=Amazon-AWS&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"/>

<br/>

<br/>

------



## Background

### 프로젝트 동기

[BOJ]([https://www.acmicpc.net](https://www.acmicpc.net/))는 국내 대표 프로그래밍 문제 풀이 사이트이며, 약 36만 명의 사용자와 2만여 개의 문제를 보유하고 있습니다.<sup id="a1">[1](#f1)</sup>  특히 여러 IT 기업에서 진행하는 코딩 테스트를 공부하고자 많은 취업준비생과 학생들이 이용하는 사이트이기도 합니다. 최근에는 [solved.ac](http://solved.ac)와 연계되어 사용자들이 문제별로 직접 세분화된 태그와 난이도를 매길 수 있고, 본인이 푼 문제 이력을 바탕으로 점수를 산출하여 자신의 실력이 어느 정도인지를 가늠할 수 있습니다.

프로그래밍 실력을 향상시키기 위해서는 본인의 실력에 맞는 적절한 알고리즘 유형과 난도의 문제를 선택해 푸는 것이 중요하지만, 많은 문제 수로 인해 사용자가 자신의 실력에 맞는 문제를 고르는 데 어려움을 겪는 경우가 적지 않습니다.<sup id="a2">[2](#f2)</sup>  또한 solved.ac에서는 여러 사용자 중에서 자신이 원하는 사람을 라이벌로 등록할 수 있는 기능을 제공하지만, 정작 라이벌 기능을 사용하는 유저 비율은 13%에 불과합니다.<sup id="a3">[3](#f3)</sup> 

<br/>

### 기대 효과

RECJOON 웹 서비스를 통해 개인의 실력에 맞는 알고리즘 문제를 추천하여 사용자의 문제 탐색 시간을 줄이고 학습의 효율성을 높여드리고자 합니다. 또한 개인의 수준과 풀이 이력이 비슷한 라이벌을 추천해줌으로써 경쟁 심리를 자극하여 문제 풀이 동기를 부여하고 학습 효율을 증대시킬 수 있는 효과를 기대해봅니다.

<br/>

<br/>

------



## Features

### 사용자 검색

> 원하는 추천 결과는 핸들 검색으로 간단하게.

![Handle Search](https://github.com/Glanceyes/Image-Repository/blob/main/2022/06/13/20220613_1655106073.gif?raw=true)

별도의 회원가입 없이 바로 검색창에 BOJ 핸들만 입력하세요. 사용자 검색 자동완성으로 본인의 핸들이 검색되는지도 한눈에 파악할 수 있습니다.

<br/>

<br/>

### 알고리즘 문제 추천

> 내 실력에 맞는 알고리즘 문제는 무엇일까?

![Algorithm Recommender](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655105972.gif)

유저 개개인의 solved.ac 티어와 문제 풀이 이력을 바탕으로 자신의 실력에 맞는 알고리즘 문제를 추천해드립니다.

<br/>

<br/>

### 라이벌 추천

> 나와 실력이 비슷한 라이벌은 누구지?

![Rival Recommender](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655116552.gif)



유저의 레벨별 문제 풀이 이력과 티어, 클래스, 레이팅을 종합적으로 고려하여 해당 유저의 실력과 유사한 다른 유저들을 6명<sup id="a4">[4](#f4)</sup> 추천해드립니다.

<br/>

<br/>

### 라이벌 기반 문제 추천

> 나의 라이벌이 푼 문제는 무엇일까?

![Rival's Problem Recommender](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655106250.gif)



유저의 풀이 이력을 바탕으로 라이벌은 풀었지만 유저 자신은 풀지 않은 문제도 같이 추천해드려요.

<br/>

<br/>



------



## Data Resource

<br/>

- 유저, 문제, 유저별 문제 풀이 이력: **[solved.ac 비공식 API](https://solvedac.github.io/unofficial-documentation/#/)**
- 문제가 속한 클래스: [**solved.ac 클래스 페이지**](https://solved.ac/class)에서 웹 스크레이핑

<br/>

**※ Baekjoon Online Judge에서 데이터를 웹 스크레이핑하지 않습니다.**

<br/>

------



## Data Analysis

![RECJOON_EDA](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655106882.png)

📊 **[EDA 보러 가기](https://github.com/boostcampaitech3/final-project-level3-recsys-14/blob/main/experiments/EDA/EDA.ipynb)**

**※ 데이터 분석 결과에 관한 자세한 내용은 EDA 파일을 참고해주세요.**

<br/>

------



## DL & ML Model

RECJOON에서는 정해진 주기에 따라 batch serving으로 데이터 수집과 함께 모델 학습과 예측을 실행합니다. 모든 추천 서비스는 모델 학습 후 검증 과정에서 사전에 정의된 지표를 측정하고, 주기별로 가장 좋은 결과롤 보인 모델을 예측 모델로 선택합니다.

<br/>

### 문제 추천 모델

| 모델명                           | 참조                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| RecVAE(Variational AutoEncoder)  | [Ilya Shenbin, Anton Alekseev, Elena Tutubalina, Valentin Malykh, and Sergy I. Nikolenko. 2019. RecVAE: A New Variational Autoencoder for Top-N Recommendations with Implicit Feedback. ACM](https://arxiv.org/abs/1912.11160) |
| Multi-VAE                        | [Dawen Liang, Rahul G. Krishnan, Matthew D. Hoffman, Tony Jebara. 2018. Variational Autoencoders for Collaborative Filtering', WWW '18: Proceedings of the 2018 World Wide Web Conference](https://dl.acm.org/doi/10.1145/3178876.3186150) |
| Multi-DAE(Denoising AutoEncoder) | [Dawen Liang, Rahul G. Krishnan, Matthew D. Hoffman, Tony Jebara. 2018. Variational Autoencoders for Collaborative Filtering', WWW '18: Proceedings of the 2018 World Wide Web Conference](https://dl.acm.org/doi/10.1145/3178876.3186150) |

<br/>

![model_pipeline](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/14/20220614_1655175870.png)

<br/>

유저가 푼 문제를 기반으로 Autoencoder 기반<sup id="a5">[5](#f5)</sup>의 딥 러닝 모델을 학습시키고, 검증 결과에 따라 미리 정의된 평가 지표<sup id="a6">[6](#f6)</sup> 값이 가장 결과가 잘 나온 모델을 선택합니다. 이후 선택된 모델을 바탕으로 문제 후보를 선정하고 필터링을 통해 최종 문제 추천 결과가 출력됩니다.

특히 Multi-VAE와 Multi-DAE에서는 문제의 태그에 관한 임베딩을 encoder의 입력으로 같이 넣어서 문제에 관한 side information도 같이 학습할 수 있도록 하여 성능을 향상시키고자 했습니다.<sup id="a7">[7](#f7)</sup>

<br/>

<br/>

### 라이벌 추천 모델

| 모델명                              | 참조                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| Collective MF(Matrix Factorization) | [David Cortes. 2020. Cold-start recommendations in Collective Matrix Factorization](https://arxiv.org/abs/1809.00366) |
| K-nearest neighbors                 | [Altman, and Naomi S. 1992. An introduction to kernel and nearest-neighbor nonparametric regression](https://ieeexplore.ieee.org/abstract/document/4781121) |



라이벌 추천에서는 다양한 딥 러닝 또는 머신 러닝 모델<sup id="a8">[8](#f8)</sup>을 학습시키고 사전에 정의한 온•오프라인 지표<sup id="a9">[9](#f9)</sup> 중 가장 결과가 잘 나온 모델을 예측 모델로 선정합니다.

<br/>

<br/>

### 라이벌 기반 문제 추천 모델

| 모델명                                 | 참조                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| BPR(Bayesian Personalized Ranking)     | [Steffen Rendle, Christoph Freudenthaler, Zeno Gantner, and Lars Schmidt-Thieme. 2009. BPR: Bayesian Personalized Ranking from Implicit Feedback](https://arxiv.org/abs/1205.2618) |
| ALS(Alternating Least Squares) MF      | [Yifan Hu, Yehuda Koren, and Chris Volinsky. 2008. Collaborative Filtering for Implicit Feedback Datasets](https://ieeexplore.ieee.org/abstract/document/4781121) |
| Item-based CF(Collaborative Filtering) | [Badrul Sarwar, George Karypis, Joseph Konstan, and John Riedl. 2001. Item-based Collaborative Filtering Recommendation Algorithms](https://www.researchgate.net/publication/2369002_Item-based_Collaborative_Filtering_Recommendation_Algorithms) |



라이벌 기반 문제 추천에서도 마찬가지로 여러 모델<sup id="a10">[10](#f10)</sup>을 통해 성능 지표<sup id="a11">[11](#f11)</sup>를 최소화 하는 방향으로 유저의 문제 풀이 패턴을 학습하고, 예측한 결과에서 실제로 자신이 풀었던 문제는 제외하여 필터링한 결과를 출력합니다.

<br/>

<br/>

------



## Service

### **Service Architecture**



![Architecture_0626](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/26/20220626_1656245363.png)



※ 2022년 6월 15일 전후로 AI Stages Server에서 GCP(Google Cloud Platform) VM Instance로 전환되었습니다.

<br/>

<br/>

#### **UML Sequence Diagram**

![UML Sequence Diagram](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655096955.png)

※ 유저로부터 Explicit Feedback을 받는 API가 추가되었습니다. (2022.06.11)

<br/>

<br/>

#### **Airflow DAG Workflow**

![airflow dag](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655109940.png)



<br/>

<br/>



------



## Team Members

<table>
   <tr height="160px">
      <td align="center">
         <a href="https://github.com/sun1187">
            <img src="https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655117297.png"/>
         </a>
      </td>
      <td align="center">
         <a href="https://github.com/juk1329">
            <img src="https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655117331.png"/>
         </a>
      </td>
      <td align="center">
         <a href="https://github.com/seo-h2">
            <img src="https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655117366.png"/>
         </a>
      </td>
       <td align="center">
         <a href="https://github.com/Glanceyes">
            <img src="https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655117384.png"/>
         </a>
      </td>
      <td align="center">
         <a href="https://github.com/wh4044">
            <img src="https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655117401.png"/>
         </a>
      </td>
   </tr>
   <tr>
       <td align="center"><a href="https://github.com/sun1187"><b>김은선</b></a></td>
       <td align="center"><a href="https://github.com/juk1329"><b>박정규</b></a></td>
       <td align="center"><a href="https://github.com/seo-h2"><b>이서희</b></a></td>
      <td align="center"><a href="https://github.com/Glanceyes"><b>이선호</b></a></td>
       <td align="center"><a href="https://github.com/wh4044"><b>진완혁</b></a></td>
   </tr>
   <tr>
      <td align="center">라이벌 추천 모델링<br/>라이벌 문제 추천 모델링<br/>태스크 자동화<br/>모델 실행 코드 모듈화</td>
      <td align="center">데이터 EDA<br/>Front-end 개발<br/>GCP로 Airflow 이전</td>
      <td align="center">라이벌 추천 모델링<br/>라이벌 문제추천 모델링<br/>온•오프라인 지표 개발<br/>라이벌 추천 고도화</td>
      <td align="center">Back-end 개발<br/>Front-end 디자인<br/>CI & CD 자동화<br/>문제 추천 모델 전처리</td>
      <td align="center">데이터 수집과 EDA<br/>문제 추천 모델링<br/>티어 필터링</td>
   </tr>
</table>
<br/>

<br/>

------



## Further Information

<br/>

📹 **[발표 영상 보러 가기](https://www.youtube.com/watch?v=S5TFpJ0uZrA)**   🔖 **[발표 자료 보러 가기](https://github.com/boostcampaitech3/final-project-level3-recsys-14/blob/main/experiments/documents/RECJOON_Presentation.pdf)**

프로젝트에 관한 전반적인 내용 소개는 발표 영상 또는 자료를 확인해주세요.

<br/>

📃 **[Wrap-up Report 보러 가기](https://github.com/boostcampaitech3/final-project-level3-recsys-14/blob/main/experiments/documents/RECJOON_Wrap-up_Report.pdf)**

주 사용 모델 실험•분석 결과와 프로젝트 진행에 관한 자세한 내용은 발표 자료와 Wrap-up Report를 참고해 주세요.

<br/>

💻 **[RECJOON Server Git Repository](https://github.com/RecSys-RECognizer/RECJOON-Server)**

GitHub Action 권한 문제로 인해 웹 서버로의 배포는 현재 Repository를 통해 이루어지지 않습니다.

실제 웹 서버로 배포된 코드는 위의 Git Repository를 참고해주세요.

<br/>

<br/>

------



## Annotation





<b id="f1">1.</b> Baekjoon Online Judge 사이트 유저 수와 공개된 문제 수 (2022.04.21) [↩](#a1)

<b id="f2">2.</b> Baekjoon Online Judge 문제와 라이벌 추천 서비스 예상 선호도 조사. 'BOJ 문제를 선택하는 데 있어서 어느 정도의 어려움을 겪고 있으신가요?'. 약 51.1%의 응답자 보통 이상 응답. (45명 참여, S 대학교 ICPC Team Slack 채널 등)[↩](#a2)

<b id="f3">3.</b> EDA 분석 결과, '라이벌과 역라이벌 수 분석' (2022.04.21) [↩](#a3)

<b id="f4">4.</b> 서비스 개시일 기준 (2022.06.11), 추후 변동 가능 [↩](#a4)

<b id="f5">5.</b> RecVAE(Variational AutoEncoder), Multi-VAE, Multi-DAE(Denoising AutoEncoder) (서비스 개시일 기준, 2022.06.11) [↩](#a5)

<b id="f6">6.</b> Recall@30(모델이 해당 유저가 좋아할 것이라고 예측한 상위 30개 문제가 실제로 유저가 좋아하는 문제에 속하는 비율) [↩](#a6)

<b id="f7">7.</b> [Yifan Chen, and Maarten de Rijke. 2017. A Collective Variational Autoencoder for Top-N Recommendation with Side Information. ACM](https://dl.acm.org/doi/10.1145/3270323.3270326) [↩](#a7)

<b id="f8">8.</b> Collaborative MF(Matrix Factorization), K-nearest neighbors (서비스 개시일 기준, 2022.06.11) [↩](#a8)

<b id="f9">9.</b> solved.ac 레이팅 산출법에 기반한 아래 세 가지 지표 값의 평균

![라이벌추천지표1](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655120252.svg)

![라이벌추천지표2](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655120195.svg)

![라이벌추천지표3](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655119880.svg)[↩](#a9)

<b id="f10">10.</b> BPR(Bayesian Personalized Ranking), ALS(Alternating Least Squares) Matrix Factorization, item-based CF(Collaborative Filtering) (서비스 개시일 기준, 2022.06.11) [↩](#a10)

<b id="f11">11.</b> 추천된 문제와 타겟 유저가 푼 문제의 난이도 차이를 기반으로 구한 지표

![라이벌 문제 추천 지표](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655119568.svg)[↩](#a11)





