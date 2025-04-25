import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { aiSocket } from '/src/apis/aiWebSocketClient';
import { enhanceWithImage, refineWithImage, updateRedisMessage } from '/src/apis/fastapi';
import { refineWithWebSocket } from '/src/apis/refineWithWebSocket';
import { getUserFont } from '/src/apis/user';
import LetterImg1 from '/src/assets/images/letter/letter1.png';
import LetterImg2 from '/src/assets/images/letter/letter2.png';
import LetterImg3 from '/src/assets/images/letter/letter3.png';
import LetterImg4 from '/src/assets/images/letter/letter4.png';
import { getFontStyle } from '/src/util/getFont';

import { IcArrowLeft, IcArrowRight2 } from '../../../assets/icons';
import { LetterImageList, LetterTextList, RedisMessageKey } from '../../../recoil/atom';
import Header from '../../common/Header';
import AiButton from './AiButton';
import EmptyWarningModal from './AiEmptyWarningModal';
import AiEnhanceModal from './AiEnhanceModal';
import AiRefineModal from './AiRefineModal';
import LetterEditor from './LetterEditor';

const LetterPreview = () => {
  const location = useLocation();
  const postcard = location.state?.postcard;
  const segmentedText = location.state?.segmentedText;

  const localImageList = useRecoilValue(LetterImageList);

  const [imageList, setImageList] = useState([]);
  const [textList, setTextList] = useState([]);
  const [refineSuggestions, setRefineSuggestions] = useState([]);
  const [refineStreamTextList, setRefineStreamTextList] = useState([]);
  const completedIndicesRef = useRef(new Set());

  const [enhanceTips, setEnhanceTips] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [userFont, setUserFont] = useState(undefined);
  const [isRefining, setIsRefining] = useState(false);
  const redisKey = useRecoilValue(RedisMessageKey);

  const setLetterTextList = useSetRecoilState(LetterTextList);

  const IMAGE_BASE_URL = import.meta.env.VITE_FAST_API_BASE_URL + '/static/uploads/';
  const DEBOUNCE_DELAY = 500;

  const contentConfig = [
    { template: 'main', imageCount: 1, textCount: 1, background: LetterImg1 },
    { template: 'film', imageCount: 5, textCount: 1, background: LetterImg2 },
    { template: 'polar', imageCount: 2, textCount: 1, background: LetterImg3 },
    { template: 'card', imageCount: 2, textCount: 2, background: LetterImg4 },
    { template: 'end', imageCount: 1, textCount: 0, background: null },
  ];

  let imageIndex = 0;
  let textIndex = 0;
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    swipe: false,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
  };

  const updateRedisDebounced = useCallback(
    debounce((key, content) => {
      updateRedisMessage(key, content);
      // console.log('updated:', key, content);
    }, DEBOUNCE_DELAY),
    [],
  );

  // useEffect(() => {
  //   aiSocket.connect(); // 🔌 마운트 시 연결
  //   return () => aiSocket.close(); // ❌ 언마운트 시 해제
  // }, []);

  useEffect(() => {
    if (redisKey) {
      const joinedMessage = textList.join('\n\n');
      updateRedisDebounced(redisKey, joinedMessage);
    }
  }, [textList, redisKey, updateRedisDebounced]);

  useEffect(() => {
    if (localImageList && localImageList.length > 0) {
      const images = localImageList.map((img) => img.url);
      const extendedImages = [...images, images[0]];
      setImageList(extendedImages);
    } else if (postcard?.images?.length > 0) {
      const images = postcard.images.map((img) => `${IMAGE_BASE_URL}${img.filename}`);
      const extendedImages = [...images, images[0]];
      setImageList(extendedImages);
    }

    if (segmentedText && segmentedText.length > 0) {
      setTextList(segmentedText);
      setLetterTextList(segmentedText);
    }
  }, [localImageList, postcard, segmentedText]);

  useEffect(() => {
    const fetchFont = async () => {
      const { font } = await getUserFont();
      setUserFont(getFontStyle(font));
    };

    fetchFont();
  }, []);

  const handleTextChange = (index, value) => {
    const updated = [...textList];
    updated[index] = value;
    setTextList(updated);
    setLetterTextList(updated);
  };

  const contents = contentConfig.map(({ template, imageCount, textCount, background }) => {
    const images = imageList.slice(imageIndex, imageIndex + imageCount);
    const textStartIndex = textIndex;

    imageIndex += imageCount;
    textIndex += textCount;

    return {
      template,
      images: imageCount === 1 ? images[0] : images,
      textStartIndex,
      textCount,
      background,
    };
  });

  // 여기부터 AI
  const handleUseRefineText = async (suggestionList) => {
    const updated = [...textList];
    const { textStartIndex, textCount } = contents[currentSlide];
    const slicedSuggestions = suggestionList.slice(0, textCount);

    for (let i = 0; i < textCount; i++) {
      updated[textStartIndex + i] = slicedSuggestions[i] || '';
    }

    setTextList(updated);
    setLetterTextList(updated);
    setActiveModal(null);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // REST API 방식
  // useEffect(() => {
  //   const fetchAiSuggestions = async () => {
  //     if (!['edit', 'add'].includes(activeModal)) return;

  //     const { textStartIndex, textCount } = contents[currentSlide];
  //     const slideTexts = textList.slice(textStartIndex, textStartIndex + textCount);

  //     if (slideTexts.length < textCount) {
  //       console.warn('[❌ 텍스트 부족] 예상보다 텍스트 수가 적음');
  //       setActiveModal('emptyWarning');
  //       return;
  //     }

  //     const isEmpty = slideTexts.some((text) => !text || text.trim() === '');
  //     if (isEmpty) {
  //       setActiveModal('emptyWarning');
  //       return;
  //     }

  //     const filenames = getFilenamesFromPostcard(currentSlide);

  //     console.log('[🖼️ AI 요청용 이미지 파일명]', filenames);
  //     console.log('[📝 슬라이드 텍스트]', slideTexts);

  //     if (!filenames || filenames.length === 0) return;

  //     setIsRefining(true);

  //     if (activeModal === 'edit') {
  //       // const result = await refineWithImage({ slideTexts, filenames });
  //       const result = await refineWithWebSocket({ slideTexts, filenames });
  //       if (Array.isArray(result)) {
  //         setRefineSuggestions(result);
  //       }
  //     }

  //     // if (activeModal === 'add') {
  //     //   const result = await enhanceWithImage({ text: slideText, filenames });
  //     //   if (result) setEnhanceTips(result);
  //     // }

  //     setIsRefining(false);
  //   };

  //   fetchAiSuggestions();
  // }, [activeModal, currentSlide]);

  useEffect(() => {
    const fetchAiSuggestions = async () => {
      if (activeModal !== 'edit') return;

      const { textStartIndex, textCount } = contents[currentSlide];
      const slideTexts = textList.slice(textStartIndex, textStartIndex + textCount);
      const filenames = getFilenamesFromPostcard(currentSlide);

      // ✅ 텍스트 수가 부족하면 모달 닫고 경고
      if (slideTexts.length < textCount) {
        console.warn('[❌ 텍스트 부족] 예상보다 텍스트 수가 적음');
        setActiveModal('emptyWarning');
        return;
      }

      // ✅ 비어 있는 텍스트가 하나라도 있다면 경고
      const isEmpty = slideTexts.some((text) => !text || text.trim() === '');
      if (isEmpty) {
        setActiveModal('emptyWarning');
        return;
      }

      if (!slideTexts.length || !filenames.length) return;

      setIsRefining(true);
      setRefineStreamTextList(() => Array(textCount).fill(''));
      completedIndicesRef.current = new Set();

      for (let i = 0; i < slideTexts.length; i++) {
        const currentIndex = i;
        const currentText = slideTexts[currentIndex];
        let accumulated = '';

        // 여기를 클로저로 완전히 고립
        await new Promise((resolve) => {
          refineWithWebSocket({
            slideTexts: [currentText], // 문장 하나만
            filenames,
            onStream: (chunk) => {
              if (completedIndicesRef.current.has(currentIndex)) return;

              accumulated += chunk;

              setRefineStreamTextList((prev) => {
                if (currentIndex >= prev.length) return prev;
                const updated = [...prev];
                updated[currentIndex] = accumulated;
                return updated;
              });
            },
            onDone: () => {
              completedIndicesRef.current.add(currentIndex);
              resolve();
            },
            onError: (err) => {
              console.error(`❌ refine error at index ${currentIndex}:`, err);
              completedIndicesRef.current.add(currentIndex);
              resolve(); // 실패해도 다음 문장으로 넘어가야 함
            },
          });
        });
      }

      setIsRefining(false);
    };

    fetchAiSuggestions();
  }, [activeModal, currentSlide]);

  const getFilenamesFromPostcard = (slideIndex) => {
    const imageIndexes = computeImageIndexesPerSlide()[slideIndex];
    return imageIndexes.map((idx) => postcard?.images?.[idx]?.filename).filter(Boolean);
  };

  const computeImageIndexesPerSlide = () => {
    const map = [];
    let imageIndex = 0;

    for (let i = 0; i < contentConfig.length; i++) {
      const imageCount = contentConfig[i].imageCount;
      const indexes = Array.from({ length: imageCount }, (_, j) => imageIndex + j);
      map.push(indexes);
      imageIndex += imageCount;
    }

    return map;
  };

  return (
    <StLetterPreview>
      <Header headerName="편지쓰기" missBack={true} />
      <ContentWrapper>
        <StyledSlider ref={sliderRef} {...settings}>
          {contents.map((item, id) => (
            <LetterEditor
              key={id}
              template={item.template}
              images={item.images}
              background={item.background}
              textStartIndex={item.textStartIndex}
              textCount={item.textCount}
              textList={textList}
              onTextChange={handleTextChange}
              font={userFont}
            />
          ))}
        </StyledSlider>
      </ContentWrapper>

      {currentSlide !== contents.length - 1 && (
        <AiButton
          onOpenModal={(type) => {
            setActiveModal(type);
          }}
        />
      )}

      {/* 모달 */}
      {/* {activeModal === 'add' && (
        <AiEnhanceModal onClose={closeModal} font={userFont} tips={enhanceTips} />
      )} */}
      {activeModal === 'edit' && (
        <AiRefineModal
          onClose={closeModal}
          font={userFont}
          suggestions={refineSuggestions}
          refineStreamTextList={refineStreamTextList}
          onUse={handleUseRefineText}
          isLoading={isRefining}
        />
      )}
      {activeModal === 'emptyWarning' && <EmptyWarningModal onClose={closeModal} />}
    </StLetterPreview>
  );
};

export default LetterPreview;

const StLetterPreview = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.White};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 8rem 3rem;
`;

const StyledSlider = styled(Slider)`
  width: 100%;

  .slick-list {
    overflow: hidden;
    height: 100%;
  }

  .slick-track {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .slick-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const NextArrow = ({ onClick, currentSlide, slideCount }) => {
  if (currentSlide === slideCount - 1) return null;
  return (
    <ArrowRight onClick={onClick}>
      <IcArrowRight2 />
    </ArrowRight>
  );
};

const PrevArrow = ({ onClick, currentSlide }) => {
  if (currentSlide === 0) return null;
  return (
    <ArrowLeft onClick={onClick}>
      <IcArrowLeft />
    </ArrowLeft>
  );
};

const ArrowBase = styled.div`
  position: absolute;
  top: 50%;
  z-index: 10;
  font-size: 2.4rem;
  color: #aaa;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #333;
  }
`;

const ArrowLeft = styled(ArrowBase)`
  left: -2rem;
`;

const ArrowRight = styled(ArrowBase)`
  right: -2rem;
`;

const Modal = ({ children, onClose }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  </div>
);
