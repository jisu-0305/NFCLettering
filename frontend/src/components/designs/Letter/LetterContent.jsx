import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useToggle from '/src/hooks/common/useToggle';
import { getFontStyle } from '/src/util/getFont';

import { getHighImage } from '../../../apis/letter';
import LongButton from '../../common/button/LongButton';
import ImageModal from '../../common/modal/ImageModal';
import ReplyComponent from '../ReplyComponent';
import EndTemplate from './EndTemplate';
import FilmTemplate from './FilmTemplate';
import GridTemplate from './GridTemplate';
import MainTemplate from './MainTemplate';
import PolarTemplate from './PolarTemplate';

const LetterContent = ({
  template,
  images,
  text,
  background,
  isActive,
  font,
  senderName,
  dearName,
  messageId,
  replyText,
  isSender,
}) => {
  const navigate = useNavigate();
  const fontStyle = getFontStyle(font);
  const [highImageUrls, setHighImageUrls] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const { toggle: isModalOpen, setToggle: setIsModalOpen } = useToggle(false);

  const handleImageClick = async (index) => {
    setSelectedImageIndex(index);

    if (!highImageUrls[index]) {
      const { imageHighUrl } = await getHighImage(messageId, index);

      setHighImageUrls((prev) => {
        const newUrls = [...prev];
        newUrls[index] = imageHighUrl;
        return newUrls;
      });
    }
    setIsModalOpen(true);
  };

  const handleFilmClick = async () => {
    const filmImages = images;
    const newHighImageUrls = await Promise.all(
      filmImages.map(async (img) => {
        if (!highImageUrls[img.index]) {
          const { imageHighUrl } = await getHighImage(messageId, img.index);
          return imageHighUrl;
        }
        return highImageUrls[img.index];
      }),
    );
    setHighImageUrls(newHighImageUrls);
    setSelectedImageIndex(0);
    setIsModalOpen(true);
  };

  return (
    <StLetterWrapper $background={background} $templateType={template}>
      <StContentWrapper>
        {template === 'main' && (
          <>
            <MainTemplate images={images} onImageClick={handleImageClick} />
            <StDearText $userFont={fontStyle}>{dearName} 에게</StDearText>
            <StLetterText $userFont={fontStyle}>{text[0]}</StLetterText>
          </>
        )}
        {template === 'film' && (
          <>
            <StLetterText $userFont={fontStyle}>{text[0]}</StLetterText>
            <FilmTemplate images={images} onFilmClick={handleFilmClick} />
          </>
        )}
        {template === 'polar' && (
          <>
            <PolarTemplate images={images} isActive={isActive} onImageClick={handleImageClick} />
            <StLetterLongText $userFont={fontStyle}>{text[0]}</StLetterLongText>
          </>
        )}
        {template === 'card' && (
          <>
            <StLetterText $userFont={fontStyle}>{text[0]}</StLetterText>
            <GridTemplate images={images} onImageClick={handleImageClick} />
            <StLetterText $userFont={fontStyle}>{text[1]}</StLetterText>
            <StSenderText $userFont={fontStyle}>{senderName} 로부터</StSenderText>
          </>
        )}
        {template === 'answer' && (
          <>
            <StLetterText $userFont={fontStyle}>
              {text[0]}
              <br /> {text[1]}
            </StLetterText>
            <EndTemplate images={images} onImageClick={handleImageClick} />
            <ReplyComponent
              messageId={messageId}
              replyText={replyText}
              dearName={dearName}
              isSender={isSender}
            />
            <StBtnWrapper>
              {isSender ? (
                <LongButton btnName="목록으로" onClick={() => navigate('/mailbox')} />
              ) : (
                <LongButton btnName="목록으로" onClick={() => navigate('/dear/mailbox')} />
              )}
            </StBtnWrapper>
          </>
        )}
      </StContentWrapper>

      {isModalOpen &&
        selectedImageIndex !== null &&
        (template === 'film' ? (
          <ImageModal
            isShowing={isModalOpen}
            images={highImageUrls}
            initialIndex={selectedImageIndex}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <ImageModal
            isShowing={isModalOpen}
            imageUrl={highImageUrls[selectedImageIndex]}
            onClose={() => setIsModalOpen(false)}
          />
        ))}
    </StLetterWrapper>
  );
};

export default LetterContent;

const StBtnWrapper = styled.div`
  width: 29rem;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  margin: 2rem 1rem;
`;

const StLetterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* width: 33rem;
  height: 55rem; */

  width: ${({ $templateType }) => ($templateType === 'answer' ? 'auto' : '33rem')};
  height: ${({ $templateType }) => ($templateType === 'answer' ? '60rem' : '55rem')};
  padding-top: ${({ $templateType }) => ($templateType === 'answer' ? '7rem' : '0')};

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

  /* padding: 0 2rem; */
`;

const StDearText = styled.div`
  ${({ $userFont, theme }) => theme.fonts[$userFont]};
  color: ${({ theme }) => theme.colors.Gray1};
  word-wrap: break-word;
  white-space: normal;
  overflow: auto;
  text-align: left;

  width: 100%;
  box-sizing: border-box;
  margin: 0.5rem 1rem;
`;

const StSenderText = styled.div`
  ${({ $userFont, theme }) => theme.fonts[$userFont]};
  color: ${({ theme }) => theme.colors.Gray1};
  word-wrap: break-word;
  white-space: normal;
  overflow: auto;
  text-align: right;

  width: 100%;
  box-sizing: border-box;
  margin: 0.5rem 1rem;
`;

const StLetterText = styled.div.attrs(() => ({
  onTouchStart: (e) => e.stopPropagation(),
  onTouchMove: (e) => e.stopPropagation(),
}))`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  width: 100%;
  box-sizing: border-box;
  margin: 0rem 1rem;
  max-height: 12rem;
  min-height: 4rem;
  overflow-y: auto;
  overflow-x: hidden;

  ${({ $userFont, theme }) => theme.fonts[$userFont]};
  color: ${({ theme }) => theme.colors.Gray2};
  word-wrap: break-word;
  overflow: auto;
  white-space: normal;
  z-index: 50;
`;

const StLetterLongText = styled.div.attrs(() => ({
  onTouchStart: (e) => e.stopPropagation(),
  onTouchMove: (e) => e.stopPropagation(),
}))`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  width: 100%;
  box-sizing: border-box;
  margin: 0rem 1rem;
  max-height: 15rem;
  min-height: 4rem;
  overflow-y: auto;
  overflow-x: hidden;

  ${({ $userFont, theme }) => theme.fonts[$userFont]};
  color: ${({ theme }) => theme.colors.Gray2};
  word-wrap: break-word;
  overflow: auto;
  white-space: normal;
  z-index: 50;
`;
