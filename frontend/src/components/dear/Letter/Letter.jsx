import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { getLetterDetail } from '/src/apis/letter';
import { getLetterDate } from '/src/util/getFormatDate';

import DummyImg from '../../../assets/dummy/letter.jpg';
import EnvelopeBottomImg from '../../../assets/images/letter/bottom_fold.png';
import LetterImg from '../../../assets/images/letter/letter_paper.png';
import LetteringImg from '../../../assets/images/letter/lettering.png';
import EnvelopeTopImg from '../../../assets/images/letter/top_fold.png';
import StampImg from '../../../assets/images/letter/vintage_stamp.png';

const Letter = () => {
  const navigate = useNavigate();
  const { messageId } = useParams();
  const location = useLocation();
  const imageUrl = location.state?.imageUrl;

  const [letterData, setLetterData] = useState(null);
  const [ImageData, setImageData] = useState(null);
  const [letterFont, setLetterFont] = useState(null);
  const [nickName, setNickName] = useState(null);
  const [nfcName, setNfcName] = useState(null);

  const angle = (90 + 3.71) * (Math.PI / 180); // 라디안 변환
  const distance = 200;

  const x = Math.cos(angle) * distance;
  const y = -Math.sin(angle) * distance;

  useEffect(() => {
    const preloadImages = [EnvelopeTopImg, EnvelopeBottomImg, LetterImg, LetteringImg, StampImg];

    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!letterData || !ImageData) {
      const fetchLetter = async () => {
        const {
          nfcName,
          nickName,
          letterContents,
          letterImages,
          font,
          conditionTime,
          firstOpenedTime,
        } = await getLetterDetail(messageId);

        const sentAt = getLetterDate(conditionTime);
        const readAt = getLetterDate(firstOpenedTime);

        const originalImageData = letterImages.map((img, index) => ({
          ...img,
          index,
        }));

        const newImageData = [...originalImageData, { ...originalImageData[0], index: 0 }];

        const newLetterContents = [
          ...letterContents,
          `${sentAt}에 보낸 편지를`,
          `${readAt}에 열었습니다.`,
        ];

        setNfcName(nfcName);
        setNickName(nickName);
        setImageData(newImageData);
        setLetterData(newLetterContents);
        setLetterFont(font);
      };

      fetchLetter();
    }
  }, [messageId, letterData, ImageData]);

  const handleNavigate = () => {
    navigate(`/dear/letter/detail/${messageId}`, {
      state: {
        imageUrl,
        letterData,
        ImageData,
        letterFont,
        nickName,
        nfcName,
      },
    });
  };

  return (
    <StWrapper>
      <StEnvelopeWrapper onClick={() => navigate(`/dear/letter/detail/${messageId}`)}>
        <StEnvelopeTop src={EnvelopeTopImg} alt="편지 봉투 윗부분" />

        <StLetter
          src={LetterImg}
          alt="편지지"
          initial={{ y: 0, x: 0, opacity: 1 }}
          animate={{ x, y, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />

        <StLetterImage
          src={imageUrl}
          alt="편지 사진"
          initial={{ y: 0, x: 0, opacity: 1, rotate: -3.7 }}
          animate={{ x, y, opacity: 1, rotate: -3.7 }}
          transition={{ duration: 1.2 }}
          onAnimationComplete={() => {
            setTimeout(() => {
              handleNavigate();
            }, 800);
          }}
        />

        <StStampImage
          src={StampImg}
          alt="스탬프"
          initial={{ y: 0, x: 0, opacity: 1, rotate: -3.7 }}
          animate={{ x, y, opacity: 1, rotate: -3.7 }}
          transition={{ duration: 1.2 }}
        />
        <StTextImage
          src={LetteringImg}
          alt="레터링"
          initial={{ y: 0, x: 0, opacity: 1, rotate: -3.7 }}
          animate={{ x, y, opacity: 1, rotate: -3.7 }}
          transition={{ duration: 1.2 }}
        />
        <StEnvelope src={EnvelopeBottomImg} alt="편지 봉투" />
        <StBlankWhite />
      </StEnvelopeWrapper>
    </StWrapper>
  );
};

export default Letter;

const StWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const StEnvelopeWrapper = styled.div`
  position: relative;
  width: 30rem;
  height: auto;
  transform: translateY(-5rem);
`;

const StEnvelopeTop = styled.img`
  position: absolute;
  width: 34rem;
  top: -9.5rem;
  left: -2.4rem;
  z-index: 1;
`;

const StLetter = styled(motion.img)`
  position: absolute;
  left: 1rem;
  top: 1rem;
  width: 29rem;
  z-index: 2;
`;

const StStampImage = styled(motion.img)`
  position: absolute;
  top: 4.2rem;
  right: 3.8rem;
  width: 6.5rem;
  z-index: 4;
`;

const StTextImage = styled(motion.img)`
  position: absolute;
  top: 17rem;
  left: 1.7rem;
  width: 29rem;
  z-index: 4;
`;

const StLetterImage = styled(motion.img)`
  position: absolute;
  top: 7.2rem;
  left: 6.8rem;
  width: 17.2rem;
  height: 17.2rem;
  object-fit: cover;
  z-index: 3;
`;

const StBlankWhite = styled.div`
  position: absolute;
  background-color: white;
  width: 31rem;
  height: 20rem;
  top: 12rem;
  z-index: 4;
  transform: rotate(-3.71deg);
`;

const StEnvelope = styled.img`
  position: absolute;
  width: 31rem;
  top: 1rem;
  z-index: 5;
`;
