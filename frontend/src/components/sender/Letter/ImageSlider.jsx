import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';

const ImageSlider = ({ images }) => {
  return (
    <SliderWrapper>
      {images.map((image) => (
        <DraggableImage key={image.id} image={image} />
      ))}
    </SliderWrapper>
  );
};

const DraggableImage = ({ image }) => {
  const [, drag] = useDrag({
    type: 'image',
    item: { image }, // { file, url, id }
  });

  return (
    <ImageBox ref={drag}>
      <img src={image.url} alt="img" />
    </ImageBox>
  );
};

export default ImageSlider;

const SliderWrapper = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  overflow-x: auto;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid #ddd;
`;

const ImageBox = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  cursor: grab;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
  }
`;
