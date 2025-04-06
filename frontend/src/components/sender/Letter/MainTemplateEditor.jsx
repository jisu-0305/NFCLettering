import React from 'react';
import styled from 'styled-components';

import LetteringImg from '../../../assets/images/letter/Lettering.svg';
import StampImg from '../../../assets/images/letter/vintage_stamp.png';

const MainTemplateEditor = ({ images }) => {
  const mainImg = images;

  return (
    <StWrapper>
      <StLetterImage src={mainImg?.url} alt="편지 사진" />
      <StStampImage src={StampImg} alt="스탬프" />
      <StTextImage src={LetteringImg} alt="레터링" />
    </StWrapper>
  );
};

export default MainTemplateEditor;

const StWrapper = styled.div`
  width: 100%;
  height: 22rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6rem;
`;

const StStampImage = styled.img`
  position: absolute;
  top: 0.7rem;
  right: 0.5rem;
  width: 6.5rem;
  z-index: 4;
`;

const StTextImage = styled.img`
  position: absolute;
  top: 14rem;
  left: -3.3rem;
  width: 29.2rem;
  z-index: 4;
`;

const StLetterImage = styled.img`
  position: absolute;
  top: 3rem;
  left: 3rem;
  width: 17.2rem;
  height: 17.2rem;
  object-fit: cover;
  z-index: 3;
`;
