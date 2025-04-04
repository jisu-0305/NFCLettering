import React, { useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import LongButton from '../../common/button/LongButton';
import EndTemplateEditor from './EndTemplateEditor';
import FilmTemplateEditor from './FilmTemplateEditor';
import GridTemplateEditor from './GridTemplateEditor';
import ImageSlider from './ImageSlider';
import MainTemplateEditor from './MainTemplateEditor';
import PolarTemplateEditor from './PolarTemplateEditor';
import TextAreaEditor from './TextAreaEditor';

const NUM_SLOTS = 4;

const LetterEditor = ({
  template,
  images, // 전체 이미지 배열
  usedImages, // 현재 페이지에서 사용 중인 이미지들
  background,
  textList,
  textStartIndex = 0,
  onTextChange,
  font,
}) => {
  const navigate = useNavigate();

  const [imageSlots, setImageSlots] = useState(
    Array(NUM_SLOTS)
      .fill(null)
      .map((_, i) => usedImages?.[i] || null),
  );

  const handleDropImage = (slotIndex, image) => {
    const newSlots = [...imageSlots];
    newSlots[slotIndex] = image;
    setImageSlots(newSlots);
  };

  const handleRemoveImage = (slotIndex) => {
    const newSlots = [...imageSlots];
    newSlots[slotIndex] = null;
    setImageSlots(newSlots);
  };

  const usedImageIds = useMemo(
    () =>
      new Set(
        imageSlots
          .filter(Boolean)
          .map((img) => img?.id)
          .filter(Boolean),
      ),
    [imageSlots],
  );

  const availableImages = useMemo(
    () => images.filter((img) => !usedImageIds.has(img.id)),
    [images, usedImageIds],
  );

  const renderTextArea = (index) => {
    const globalIndex = textStartIndex + index;
    const value = textList?.[globalIndex] || '';

    return (
      <TextAreaEditor
        key={index}
        value={value}
        onChange={(newValue) => onTextChange(globalIndex, newValue)}
        font={font}
      />
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <StLetterWrapper $background={background}>
        <StContentWrapper>
          {template === 'main' && (
            <>
              <MainTemplateEditor
                images={imageSlots}
                onDropImage={handleDropImage}
                onRemoveImage={handleRemoveImage}
              />
              {renderTextArea(0)}
            </>
          )}
          {template === 'film' && (
            <>
              {renderTextArea(0)}
              <FilmTemplateEditor
                images={imageSlots}
                onDropImage={handleDropImage}
                onRemoveImage={handleRemoveImage}
              />
            </>
          )}
          {template === 'polar' && (
            <>
              <PolarTemplateEditor
                images={imageSlots}
                onDropImage={handleDropImage}
                onRemoveImage={handleRemoveImage}
              />
              {renderTextArea(0)}
            </>
          )}
          {template === 'card' && (
            <>
              {renderTextArea(0)}
              <GridTemplateEditor
                images={imageSlots}
                onDropImage={handleDropImage}
                onRemoveImage={handleRemoveImage}
              />
              {renderTextArea(1)}
            </>
          )}
          {template === 'end' && (
            <>
              <StEndText>편지 작성을 다 완료하셨나요?</StEndText>
              <StEndText>한번 보낸 편지는 수정할 수 없어요</StEndText>
              <EndTemplateEditor images={imageSlots} />
              <LongButton onClick={() => navigate('/selectdear')} btnName="편지 전송하기" />
            </>
          )}
        </StContentWrapper>
      </StLetterWrapper>

      <ImageSlider images={availableImages} />
    </DndProvider>
  );
};

export default LetterEditor;

const StLetterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 33rem;
  height: 55rem;
  background-image: url(${(props) => props.$background});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
`;

const StContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100%;
`;

const StEndText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.fonts.Gomsin1};
`;
