# **나를 위한 알고리즘 문제와 라이벌 추천, RECJOON**



![recjoon-main7-large](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655085908.png)

## Baekjoon Online Judge 문제 추천과 solved.ac 라이벌 추천 서비스



딥 러닝과 머신 러닝을 사용하여 BOJ(Baekjoon Online Judge)와 solved.ac 유저의 개인별 문제 풀이 이력을 바탕으로 본인의 수준에 맞는 문제와 라이벌을 추천하는 AI 모델 기반 서비스입니다.



![computers](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655087579.png)

🖥 **[웹 사이트 보러 가기](http://recjooon.com)**

※ 본 웹 서비스는 베타 버전이며 2022년 7월 31일까지 한시적으로 운영될 예정입니다.





------



## Background

### 프로젝트 동기

BOJ([https://www.acmicpc.net](https://www.acmicpc.net/))는 국내 대표 프로그래밍 문제 풀이 사이트이며, 약 36만 명의 사용자와 2만여 개의 문제를 보유하고 있습니다.<sup id="a1">[1](#f1)</sup>  특히 여러 IT 기업에서 진행하는 코딩 테스트를 공부하고자 많은 취업준비생과 학생들이 이용하는 사이트이기도 합니다. 최근에는 solved.ac와 연계되어 사용자들이 문제별로 직접 세분화된 태그와 난이도를 매길 수 있고, 본인이 푼 문제 이력을 바탕으로 점수를 산출하여 자신의 실력이 어느 정도인지를 가늠할 수 있습니다.

프로그래밍 실력을 향상시키기 위해서는 본인의 실력에 맞는 적절한 알고리즘 유형과 난도의 문제를 선택해 푸는 것이 중요하지만, 약 2만 여 개의 많은 문제 수로 인해 사용자가 이를 탐색하는 데 어려움을 겪는 사람이 적지 않습니다.<sup id="a2">[2](#f2)</sup>  또한 solved.ac에는 여러 사용자 중에서 자신이 원하는 사람을 라이벌로 등록할 수 있지만, 정작 라이벌 기능을 사용하는 유저 비율은 13%에 불과합니다.<sup id="a3">[3](#f3)</sup> 



### 기대 효과

RECJOON 웹 서비스를 통해 개인의 실력에 맞는 알고리즘 문제를 추천하여 사용자의 문제 탐색 시간을 줄이고 효율성을 높여드리고자 합니다. 또한 개인의 수준과 풀이 이력이 비슷한 라이벌을 추천해줌으로써 경쟁 심리를 자극하여 문제 풀이 동기를 부여하고 학습 효율을 증대시킬 수 있는 효과를 기대해봅니다.





------



## Features



### 사용자 검색

> 원하는 추천 결과는 핸들 검색으로 간단하게.

![20220613_1655102630.gif](https://github.com/Glanceyes/Image-Repository/blob/main/2022/06/13/20220613_1655102630.gif?raw=true)

![ezgif-3-c6d7533c49](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655106073.gif)

별도의 회원가입 없이 바로 검색창에 BOJ 핸들만 입력하세요. 사용자 검색 자동완성으로 본인의 핸들이 검색되는지도 한눈에 파악할 수 있습니다.





### 알고리즘 문제 추천

> 내 실력에 맞는 알고리즘 문제는 무엇일까?

![ezgif-3-b6207f91b9](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655105972.gif)

유저 개개인의 solved.ac 티어와 문제 풀이 이력을 바탕으로 자신의 실력에 맞는 알고리즘 문제를 추천해드립니다.





### 라이벌 추천

> 나와 실력이 비슷한 라이벌은 누구지?

![ezgif-3-8e6db5ab06](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655105905.gif)



유저의 레벨별 문제 풀이 이력과 티어, 클래스, 레이팅을 종합적으로 고려하여 해당 유저의 실력과 유사한 다른 유저들을 6명<sup id="a4">[4](#f4)</sup> 추천해드립니다.



### 라이벌 기반 문제 추천

> 나의 라이벌이 푼 문제는 무엇일까?

![ezgif-3-9399300884](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655106250.gif)



유저의 풀이 이력을 바탕으로 라이벌은 풀었지만 유저 자신은 풀지 않은 문제도 같이 추천해드려요.





------



## Data Analysis

![스크린샷 2022-06-13 오후 4.54.37](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655106882.png)

📊 **[EDA 보러 가기](https://github.com/boostcampaitech3/final-project-level3-recsys-14/blob/feature/eda/experiments/EDA/EDA.ipynb)**

데이터 분석 결과에 관한 자세한 내용은 EDA 파일을 참고해주세요.





------



## DL & ML Model

RECJOON에서는 정해진 주기에 따라 batch serving으로 데이터 수집과 함께 모델 학습과 예측을 실행합니다. 모든 추천 서비스는 모델 학습 후 검증 과정에서 사전에 정의된 지표를 측정하고, 주기별로 가장 좋은 결과롤 보인 모델을 예측 모델로 선택합니다.



### 문제 추천 모델

| 모델명                           | 참조                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| RecVAE(Variational AutoEncoder)  | [Ilya Shenbin, Anton Alekseev, Elena Tutubalina, Valentin Malykh, and Sergy I. Nikolenko. 2019. RecVAE: A New Variational Autoencoder for Top-N Recommendations with Implicit Feedback. ACM](https://arxiv.org/abs/1912.11160) |
| Multi-VAE                        | [Dawen Liang, Rahul G. Krishnan, Matthew D. Hoffman, Tony Jebara. 2018. Variational Autoencoders for Collaborative Filtering', WWW '18: Proceedings of the 2018 World Wide Web Conference](https://dl.acm.org/doi/10.1145/3178876.3186150) |
| Multi-DAE(Denoising AutoEncoder) | [Dawen Liang, Rahul G. Krishnan, Matthew D. Hoffman, Tony Jebara. 2018. Variational Autoencoders for Collaborative Filtering', WWW '18: Proceedings of the 2018 World Wide Web Conference](https://dl.acm.org/doi/10.1145/3178876.3186150) |



유저가 푼 문제를 기반으로 Autoencoder 기반<sup id="a5">[5](#f5)</sup>의 딥 러닝 모델을 학습시키고, 검증 결과에 따라 미리 정의된 평가 지표<sup id="a6">[6](#f6)</sup> 값이 가장 결과가 잘 나온 모델을 선택합니다. 이후 선택된 모델을 바탕으로 문제 후보를 선정하고 필터링을 통해 최종 문제 추천 결과가 출력됩니다.

특히 Multi-VAE와 Multi-DAE에서는 문제의 태그에 관한 임베딩을 encoder의 입력으로 같이 넣어서 문제에 관한 side information도 같이 학습할 수 있도록 하여 성능을 향상시키고자 했습니다.<sup id="a7">[7](#f7)</sup>





### 라이벌 추천 모델

| 모델명                                 | 참조                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| Collaborative MF(Matrix Factorization) | [David Cortes. 2020. Cold-start recommendations in Collective Matrix Factorization](https://arxiv.org/abs/1809.00366) |
| K-nearest neighbors                    | [Altman, and Naomi S. 1992. An introduction to kernel and nearest-neighbor nonparametric regression](https://ieeexplore.ieee.org/abstract/document/4781121) |



라이벌 추천에서는 다양한 딥 러닝 또는 머신 러닝 모델<sup id="a8">[8](#f8)</sup>을 학습시키고 사전에 정의한 온•오프라인 지표<sup id="a9">[9](#f9)</sup> 중 가장 결과가 잘 나온 모델을 예측 모델로 선정합니다.





### 라이벌 기반 문제 추천 모델

| 모델명                                 | 참조                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| BPR(Bayesian Personalized Ranking)     | [Steffen Rendle, Christoph Freudenthaler, Zeno Gantner, and Lars Schmidt-Thieme. 2009. BPR: Bayesian Personalized Ranking from Implicit Feedback](https://arxiv.org/abs/1205.2618) |
| ALS(Alternating Least Squares) MF      | [Yifan Hu, Yehuda Koren, and Chris Volinsky. 2008. Collaborative Filtering for Implicit Feedback Datasets](https://ieeexplore.ieee.org/abstract/document/4781121) |
| Item-based CF(Collaborative Filtering) | [Badrul Sarwar, George Karypis, Joseph Konstan, and John Riedl. 2001. Item-based Collaborative Filtering Recommendation Algorithms](https://www.researchgate.net/publication/2369002_Item-based_Collaborative_Filtering_Recommendation_Algorithms) |



라이벌 기반 문제 추천에서도 마찬가지로 여러 모델<sup id="a10">[10](#f10)</sup>을 통해 성능 지표<sup id="a11">[11](#f11)</sup>를 최소화 하는 방향으로 유저의 문제 풀이 패턴을 학습하고, 예측한 결과에서 실제로 라이벌이 푼 문제는 제외하여 필터링한 결과를 출력합니다.





------



## Service

### **Service Architecture**

![Architecture_new](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655086276.png)



※ 6월 15일 전후로 AI Stages Server에서 GCP(Google Cloud Platform) Instance로 전환할 예정입니다.



#### **UML Sequence Diagram**

![image-20220613140914812](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655096955.png)





#### **Airflow DAG Workflow**

![airflow dag](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655109940.png)





------



## Further Information



🔖 **[발표 자료 보러 가기]()**

 주 사용 모델과 프로젝트 진행에 관한 자세한 내용은 발표 자료를 참고해 주세요.





------



## Reference







<b id="f1">1</b> Baekjoon Online Judge 사이트 유저 수와 공개된 문제 수 (2022.04.21) [↩](#a1)

<b id="f2">2</b> Baekjoon Online Judge 문제와 라이벌 추천 서비스 예상 선호도 조사 (45명 참여, S 대학교 ICPC Team Slack 채널 등)[↩](#a2)

<b id="f3">3</b> EDA 분석 결과, 라이벌과 역라이벌 수 분석 (2022.04.21) [↩](#a3)

<b id="f4">4</b> 서비스 개시일 기준 (2022.06.11) [↩](#a3)

<b id="f5">5</b> RecVAE(Variational AutoEncoder), Multi-VAE, Multi-DAE(Denoising AutoEncoder) [↩](#a5)

<b id="f6">6</b> Recall@30(모델이 해당 유저가 좋아할 것이라고 예측한 상위 30개 문제가 실제로 유저가 좋아하는 문제에 속하는 비율) [↩](#a6)

<b id="f7">7</b> [Yifan Chen, and Maarten de Rijke. 2017. A Collective Variational Autoencoder for Top-N Recommendation with Side Information. ACM](https://dl.acm.org/doi/10.1145/3270323.3270326) [↩](#a7)

<b id="f8">8</b> Collaborative MF(Matrix Factorization), K-nearest neighbors [↩](#a8)

<b id="f9">9</b> solved.ac 레이팅 산출법에 기반한 아래 세 가지 지표 값의 평균

 ![image-20220613145234109](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655099554.png) 

 ![image-20220613145245499](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655099566.png)

![image-20220613145305034](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655099585.png)[↩](#a9)

<b id="f10">10</b> BPR(Bayesian Personalized Ranking), ALS(Alternating Least Squares) Matrix Factorization, item-based CF(Collaborative Filtering) [↩](#a10)

<b id="f11">11</b> 추천된 문제와 타겟 유저가 푼 문제의 난이도 차이를 기반으로 구한 지표

![image-20220613145654066](https://cdn.jsdelivr.net/gh/Glanceyes/Image-Repository/2022/06/13/20220613_1655099814.png) [↩](#a11)





