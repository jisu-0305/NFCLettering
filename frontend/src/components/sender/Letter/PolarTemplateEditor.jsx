import React from 'react';
import styled from 'styled-components';

import PolarImg1 from '../../../assets/images/letter/polar1.png';
import PolarImg2 from '../../../assets/images/letter/polar2.png';

const PolarTemplateEditor = ({ images }) => {
  if (!images?.[0]?.url || !images?.[1]?.url) {
    console.warn('🚨 PolarTemplateEditor - 이미지 누락:', images);
    return null;
  }

  const img1 = images[0].url;
  const img2 = images[1].url;

  return (
    <StWrapper>
      <StPolarBack src={PolarImg1} alt="폴라로이드 배경" />
      <StImageBack src={img2} alt="사진" />
      <StPolarFront src={PolarImg2} alt="폴라로이드 배경" />
      <StImageFront src={img1} alt="사진" />
    </StWrapper>
  );
};

export default PolarTemplateEditor;

const StWrapper = styled.div`
  width: 100%;
  height: 22rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
`;

const StPolarBack = styled.img`
  position: absolute;
  top: 5rem;
  right: 0.5rem;
  width: 150px;
  object-fit: contain;
  transform: rotate(-3deg);
  z-index: 1;
`;

const StImageBack = styled.img`
  position: absolute;
  top: 66px;
  right: 20px;
  width: 123px;
  height: 140px;
  object-fit: cover;
  transform: rotate(-2.5deg);
  z-index: 2;
`;

const StPolarFront = styled.img`
  position: absolute;
  top: -1rem;
  left: 0.5rem;
  width: 150px;
  object-fit: contain;
  transform: rotate(12deg);
  z-index: 3;
`;

const StImageFront = styled.img`
  position: absolute;
  top: 1px;
  left: 22px;
  width: 123px;
  height: 140px;
  object-fit: cover;
  transform: rotate(11.5deg);
  z-index: 4;
`;
