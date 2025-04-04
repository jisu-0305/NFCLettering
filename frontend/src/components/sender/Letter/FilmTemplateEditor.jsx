import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import FilmImg from '../../../assets/images/letter/film.png';

const FilmTemplateEditor = ({ images }) => {
  const sliderRef = useRef(null);

  return (
    <StWrapper>
      <StMaskWrapper>
        <StRotateWrapper>
          <StSliderContainer ref={sliderRef}>
            <StImageSlider>
              <StSlide>
                {images.map((src, idx) => (
                  <StPhoto key={`orig-${idx}`} src={src?.url} alt={`film-${idx}`} />
                ))}
              </StSlide>
            </StImageSlider>
            <StFilmOverlay src={FilmImg} alt="필름 배경" />
          </StSliderContainer>
        </StRotateWrapper>
      </StMaskWrapper>
    </StWrapper>
  );
};

export default FilmTemplateEditor;

const StWrapper = styled.div`
  width: 100%;
  height: 22rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const StMaskWrapper = styled.div`
  position: absolute;
  width: 27.5rem;
  height: 250px;
  left: -2rem;
  overflow: hidden;
`;

const StRotateWrapper = styled.div`
  position: relative;
  width: 28rem;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StSliderContainer = styled.div`
  position: relative;
  height: 182px;
  width: 100%;
  transform: rotate(-7deg);
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StImageSlider = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const StSlide = styled.div`
  display: flex;
  padding-top: 25px;
  flex-wrap: nowrap;
`;

const StPhoto = styled.img`
  width: 136.5px;
  height: 135px;
  object-fit: cover;
  margin: 0 3.2px;
`;

const StFilmOverlay = styled.img`
  position: absolute;
  top: 4px;
  height: 180px;
  width: 715px;
  z-index: 3;
  pointer-events: none;

  ${({ $clone }) =>
    $clone &&
    css`
      left: 715px;
    `}
`;
