import React from 'react';
import styled from 'styled-components';

import confettiImg from '../../../assets/images/congratsLetter/confetti.png';
import RibbonImg from '../../../assets/images/congratsLetter/ribbon.png';

const MainTemplate = ({ images, onImageClick }) => {
  const mainImg = images?.imageLowUrl;

  return (
    <StWrapper>
      <StConfetti src={confettiImg} alt="컨페티" />
      <StLetterImage src={mainImg} alt="편지 사진" onClick={() => onImageClick(images?.index)} />
      <StRibbon src={RibbonImg} alt="레터링" />
    </StWrapper>
  );
};

export default MainTemplate;

const StWrapper = styled.div`
  width: 100%;
  height: 22rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6rem;
`;

const StConfetti = styled.img`
  position: absolute;
  top: -7.2rem;
  left: -2.8rem;
  width: 27.5rem;
  z-index: 1;
`;

const StRibbon = styled.img`
  position: absolute;
  top: 15rem;
  left: -2.8rem;
  width: 27.5rem;
  z-index: 4;
`;

const StLetterImage = styled.img`
  position: absolute;
  top: 0rem;
  left: 1rem;
  width: 20rem;
  height: 20rem;
  object-fit: cover;
  z-index: 3;
`;
