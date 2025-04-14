import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import React from 'react';
import styled from 'styled-components';

import PaperBackground from '/src/assets/background2.png';
import NoTagImg from '/src/assets/images/notag.png';
import NoTagAnimation from '/src/assets/lottie/notag.json';

import LongButton from '../../common/button/LongButton';

const Home = () => {
  return (
    <>
      <StPageWrapper $Background={PaperBackground}>
        <StTitle>Lettering</StTitle>
        <StMainText>
          편지를 보려면
          <br /> 우체통 키링을 태그해주세요
        </StMainText>

        <StImageWrapper>
          <StImage src={NoTagImg} alt="핸드폰 태깅" />
        </StImageWrapper>
        <StAnimationWrapper>
          <Lottie animationData={NoTagAnimation} loop={true} />
        </StAnimationWrapper>

        <StText>
          더 이상 유효하지 않은 링크로 접속했어요.
          <br /> 키링을 다시 태그하고, 새로운 편지를 확인해보세요.
        </StText>

        <StButtonWrapper>
          <LongButton
            onClick={() => window.open('https://letterring.shop/', '_blank')}
            btnName="나도 편지를 쓰고 싶다면?"
          />
        </StButtonWrapper>
      </StPageWrapper>
    </>
  );
};

export default Home;

const StPageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;

  background-image: url(${({ $Background }) => $Background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const StTitle = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.MainRed};
  ${({ theme }) => theme.fonts.TitleLogo};
`;

const StMainText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.Gray0};
  ${({ theme }) => theme.fonts.Title2};
`;

const StText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.Gray1};
  ${({ theme }) => theme.fonts.Saeum6};
`;

const StImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StAnimationWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const StImage = styled(motion.img)`
  width: 14rem;
  z-index: 10;
`;

const StButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 25rem;
`;
