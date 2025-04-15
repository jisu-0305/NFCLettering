import React from 'react';
import styled from 'styled-components';

import BullonImg from '../../../assets/images/congratsLetter/bullons.png';
import ConfettiImg from '../../../assets/images/congratsLetter/confetti2.png';

const SecondTemplate = ({ images, onImageClick }) => {
  const mainImg = images?.imageLowUrl;

  return (
    <StWrapper>
      <StConffetti src={ConfettiImg} alt="컨페티" />
      <StLetterImage src={mainImg} alt="편지 사진" onClick={() => onImageClick(images?.index)} />
      <StTextImage src={BullonImg} alt="레터링" />
    </StWrapper>
  );
};

export default SecondTemplate;

const StWrapper = styled.div`
  width: 100%;
  height: 22rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: start;
  margin-bottom: 8rem;
`;

const StConffetti = styled.img`
  position: absolute;
  top: -6.5rem;
  left: -3rem;
  width: 28.2rem;
  z-index: 1;
`;

const StTextImage = styled.img`
  position: absolute;
  top: 10rem;
  left: -3.1rem;
  width: 28.3rem;
  z-index: 3;
`;

const StLetterImage = styled.img`
  position: absolute;
  top: -2rem;
  left: center;
  width: 20rem;
  height: 20rem;
  object-fit: cover;
  z-index: 2;
`;
