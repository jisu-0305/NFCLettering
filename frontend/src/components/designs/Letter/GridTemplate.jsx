import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

const GridTemplate = ({ images, onImageClick }) => {
  return (
    <StWrapper>
      <StGrid>
        {images.map((img, idx) => (
          <StPhotoWrapper key={idx}>
            <StPhoto
              src={img?.imageLowUrl}
              alt={`photo-${idx}`}
              onClick={() => onImageClick(img.index)}
            />
          </StPhotoWrapper>
        ))}
      </StGrid>
    </StWrapper>
  );
};

export default GridTemplate;

const StWrapper = styled.div`
  width: 100%;
  height: 20rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.2rem;
  max-width: 40rem;
`;

const StPhotoWrapper = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4;
`;

const StPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
