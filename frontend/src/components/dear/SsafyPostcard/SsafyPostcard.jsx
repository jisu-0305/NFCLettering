import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { getPostcardDetail } from '/src/apis/postcard';
import DummyImg from '/src/assets/dummy/postcard.jpg';
import EnvelopeBottomImg from '/src/assets/images/ssafyPostcard/bottom_fold.png';
import PostcardImg from '/src/assets/images/ssafyPostcard/postcard_paper.png';
import EnvelopeTopImg from '/src/assets/images/ssafyPostcard/top_fold.png';

const Postcard = () => {
  const navigate = useNavigate();
  const { messageId } = useParams();
  const location = useLocation();
  const imageUrl = location.state?.imageUrl;

  const [postcard, setPostcard] = useState(null);

  const angle = (90 + 3.71) * (Math.PI / 180); // 라디안 변환
  const distance = 100;
  const x = Math.cos(angle) * distance;
  const y = -Math.sin(angle) * distance;

  useEffect(() => {
    const preloadImages = [EnvelopeTopImg, EnvelopeBottomImg, PostcardImg];

    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const fetchPostcard = async () => {
      const data = await getPostcardDetail(messageId);
      setPostcard(data);
    };

    fetchPostcard();
  }, [messageId]);

  const handleNavigate = () => {
    navigate(`/dear/postcard/ssafy/detail/${messageId}`, {
      state: {
        postcard,
        imageUrl,
      },
    });
  };

  return (
    <StWrapper>
      <StEnvelopeWrapper onClick={handleNavigate}>
        <StEnvelopeTop src={EnvelopeTopImg} alt="편지 봉투 윗부분" />

        <StPostcard
          src={PostcardImg}
          alt="엽서"
          initial={{ y: 0, x: 0, opacity: 1 }}
          animate={{ x, y, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <StPostcardImage
          src={imageUrl}
          alt="엽서사진"
          initial={{ y: 0, x: 0, opacity: 1, rotate: -3.7 }}
          animate={{ x, y, opacity: 1, rotate: -3.7 }}
          transition={{ duration: 1.2 }}
          onAnimationComplete={() => {
            setTimeout(() => {
              handleNavigate();
            }, 800);
          }}
        />
        <StEnvelope src={EnvelopeBottomImg} alt="편지 봉투" />
        <StBlankWhite />
      </StEnvelopeWrapper>
    </StWrapper>
  );
};

export default Postcard;

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
  width: 30.5rem;
  top: -9.5rem;
  left: -0.35rem;
  z-index: 1;
`;

const StPostcard = styled(motion.img)`
  position: absolute;
  left: 0.8rem;
  top: 1rem;
  width: 29rem;
  z-index: 2;
`;

const StPostcardImage = styled(motion.img)`
  position: absolute;
  top: 2.45rem;
  left: 2rem;
  width: 26.6rem;
  height: 19.7rem;
  object-fit: cover;
  z-index: 3;
`;

const StBlankWhite = styled.div`
  position: absolute;
  background-color: white;
  width: 31rem;
  height: 15rem;
  top: 22rem;
  z-index: 4;
  transform: rotate(-3.71deg);
`;

const StEnvelope = styled.img`
  position: absolute;
  width: 31rem;
  top: 1rem;
  z-index: 5;
`;
