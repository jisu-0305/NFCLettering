import 'swiper/css';
import 'swiper/css/effect-coverflow';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { getSenderMessages } from '../../../apis/mailbox';
import { IcDetail } from '../../../assets/icons';
import Closed2 from '../../../assets/images/mailbox/closed2.png';
import Closed1 from '../../../assets/images/mailbox/closed3.png';
import Closed3 from '../../../assets/images/mailbox/closed3.png';
import Opened2 from '../../../assets/images/mailbox/opened2.png';
import Opened1 from '../../../assets/images/mailbox/opened3.png';
import Opened3 from '../../../assets/images/mailbox/opened3.png';
import { getRelativeFormat } from '../../../util/getRelativeDate';

const images = {
  Closed1,
  Closed2,
  Closed3,
  Opened1,
  Opened2,
  Opened3,
};

const CenterCarousel = ({ selected }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [openedIndices, setOpenedIndices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const getSenderMailbox = async (currentPage) => {
    setLoading(true);
    const response = await getSenderMessages(currentPage, selected);
    const { senderMessageSummaryList } = response || {};

    if (senderMessageSummaryList) {
      if (senderMessageSummaryList.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...prev, ...senderMessageSummaryList]);
      }

      setLoading(false);
      if (currentPage === 0) {
        setInitialLoaded(true);
      }
    }
  };

  const handleClick = (idx) => {
    if (activeIndex !== idx) return;

    setOpenedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const handleSlideChange = (swiper) => {
    const newIndex = swiper.realIndex;

    if (newIndex > activeIndex && !loading && hasMore && newIndex === page * 7 + 2) {
      const nextPage = page + 1;
      setPage(nextPage);
      getSenderMailbox(nextPage);
    }

    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const resetAndFetch = async () => {
      setMessages([]);
      setPage(0);
      setHasMore(true);
      setOpenedIndices([]);
      setInitialLoaded(true);

      await getSenderMailbox(0);
    };

    resetAndFetch();
  }, [selected]);

  const getAlignType = (idx, activeIdx) => {
    const diff = idx - activeIdx;
    if (diff === 0) return 'flex-start';
    if (diff < 0) return 'flex-start';
    return 'flex-end';
  };

  const handleOpenMsg = (type, messageId) => {
    if (type === 'POSTCARD') {
      navigate(`/postcard/detail/${messageId}`);
    } else {
      navigate(`/letter/detail/${messageId}`);
    }
  };

  return (
    <StyledSwiper
      direction="vertical"
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView={5}
      onSlideChange={handleSlideChange}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
        slideShadows: false,
      }}
      modules={[EffectCoverflow]}
    >
      {messages &&
        messages.map((msg, idx) => {
          const { conditionTime, designType, id, replied, repliedName, sealingWaxId } = msg;
          const isVisible = Math.abs(activeIndex - idx) <= 2;
          const isCenter = activeIndex === idx;
          const isOpened = openedIndices.includes(idx);

          return (
            <StyledSlide key={idx} $hidden={!isVisible} onClick={() => handleClick(idx)}>
              <SlideContent $align={getAlignType(idx, activeIndex)}>
                <ImageWrapper>
                  <img
                    src={
                      isCenter && isOpened
                        ? images[`Opened${sealingWaxId}`]
                        : images[`Closed${sealingWaxId}`]
                    }
                    alt={`Slide ${idx + 1}`}
                  />
                </ImageWrapper>
                <Comment $isVisible={isOpened && isCenter}>
                  <p>
                    {repliedName}님께 보낸 {designType !== 'POSTCARD' ? '편지' : '엽서'}
                  </p>
                  <p>답장 : {replied ? 1 : 0}</p>
                </Comment>
                <Details>
                  <OpenTime>{getRelativeFormat(conditionTime)}</OpenTime>
                  {isOpened && isCenter && (
                    <DetailButton>
                      <IcDetail onClick={() => handleOpenMsg(designType, id)} />
                    </DetailButton>
                  )}
                </Details>
              </SlideContent>
            </StyledSlide>
          );
        })}
    </StyledSwiper>
  );
};

export default CenterCarousel;

const StyledSwiper = styled(Swiper)`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 90%;
  height: 45rem;
  /* overflow: hidden; */
`;

const StyledSlide = styled(SwiperSlide)`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  position: relative;

  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
  transition:
    transform 0.6s ease-in-out,
    filter 0.6s ease-in-out;
  cursor: pointer;

  &.swiper-slide-active {
    transform: scale(1.2);
    z-index: 10;
  }
`;

const SlideContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: ${({ $align }) => $align};

  position: relative;
  width: 27rem;
  height: 100%;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 60%;
  left: 1rem;
  width: 20rem;
  transform: translateY(-50%);

  img {
    width: 100%;
    object-fit: contain;
  }
`;

const Comment = styled.div`
  width: 19rem;
  padding-left: 1rem;
  padding-top: 0.5rem;
  ${({ theme }) => theme.fonts.EduBody1};
  color: ${({ theme }) => theme.colors.Gray1};
  text-align: center;
  z-index: 1;

  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const OpenTime = styled.div`
  margin-top: 2rem;
  color: ${({ theme }) => theme.colors.Gray2};
  ${({ theme }) => theme.fonts.Body5};
`;

const DetailButton = styled.button`
  margin-top: 4rem;
`;
