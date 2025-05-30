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
import MainTemplate from './MainTemplate';
import SecondTemplate from './SecondTemplate';

const CongratsLetterContent = ({
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

  return (
    <StLetterWrapper $background={background}>
      <StContentWrapper>
        {template === 'main' && (
          <>
            <MainTemplate images={images} onImageClick={handleImageClick} />
            <StDearText $userFont={fontStyle}>{dearName} 에게</StDearText>
            <StLetterText $userFont={fontStyle}>{text[0]}</StLetterText>
          </>
        )}
        {template === 'second' && (
          <>
            <SecondTemplate images={images} onImageClick={handleImageClick} />
            <StLetterText $userFont={fontStyle}>{text[0]}</StLetterText>
            <StSenderText $userFont={fontStyle}>{senderName} 로부터</StSenderText>
          </>
        )}

        {template === 'answer' && (
          <>
            <StLetterText $userFont={fontStyle}>
              {text[0]}
              <br /> {text[1]}
            </StLetterText>
            <EndTemplate images={images} />
            <ReplyComponent
              messageId={messageId}
              replyText={replyText}
              dearName={dearName}
              isSender={isSender}
            />
            <StBtnWrapper>
              <LongButton btnName="목록으로" onClick={() => navigate('/dear/mailbox')} />
            </StBtnWrapper>
          </>
        )}
      </StContentWrapper>
      {isModalOpen && selectedImageIndex !== null && highImageUrls[selectedImageIndex] && (
        <ImageModal
          isShowing={isModalOpen}
          imageUrl={highImageUrls[selectedImageIndex]}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </StLetterWrapper>
  );
};

export default CongratsLetterContent;

const StBtnWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const StLetterWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 31rem;
  height: 54rem;

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
  margin: 1rem 1rem;
  max-height: 14rem;
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
