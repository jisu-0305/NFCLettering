import imageCompression from 'browser-image-compression';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { getPostcard, segmentText, submitPostcard } from '/src/apis/fastapi';
import { getUserFont } from '/src/apis/user';
import { getFontStyle } from '/src/util/getFont';

import CircleClose from '../../../assets/images/circleClose.png';
import { LetterImageList, LetterText, RedisMessageKey } from '../../../recoil/atom';
import { convertHeicToJpeg } from '../../../util/convertHeicToJpeg';
import Header from '../../common/Header';

const LetterWriting = () => {
  const navigate = useNavigate();

  const [ImageList, setImageList] = useState([]);
  const [letterContent, setLetterContent] = useState('');
  const [userFont, setUserFont] = useState(undefined);
  const [redisKey, setRedisMessageKey] = useRecoilState(RedisMessageKey);
  const [isLoading, setIsLoading] = useState(false);
  const textCount = 5;
  const fileInputRef = useRef(null);

  const setLetterImages = useSetRecoilState(LetterImageList);
  const setLetterText = useSetRecoilState(LetterText);

  useEffect(() => {
    const fetchFont = async () => {
      const { font } = await getUserFont();
      setUserFont(getFontStyle(font));
    };

    fetchFont();
  }, []);

  const handleLetterChange = (e) => {
    setLetterContent(e.target.value);
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1080,
      useWebWorker: true,
    };
    const compressedBlob = await imageCompression(file, options);

    return new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImageItems = [];

    for (const file of files) {
      // 미리보기 먼저 생성 (압축 전 원본)
      const previewUrl = URL.createObjectURL(file);

      // 화면에 바로 표시할 미리보기용 객체
      const imageItem = { file, url: previewUrl }; // 임시 file

      newImageItems.push(imageItem);

      // 비동기적으로 압축 작업 시작
      (async () => {
        // heic 변환안함
        // let processedFile = file;
        // if (file.name.toLowerCase().endsWith('.heic')) {
        //   processedFile = await convertHeicToJpeg(file);
        // }
        // processedFile = await compressImage(processedFile);
        const processedFile = await compressImage(file);

        // 압축된 파일로 덮어쓰기
        imageItem.file = processedFile;

        // 메모리 누수 방지
        URL.revokeObjectURL(previewUrl);
        imageItem.url = URL.createObjectURL(processedFile);

        // 강제로 리렌더링 유도
        setImageList((prev) => [...prev]);
      })();
    }

    const totalImages = [...ImageList, ...newImageItems].slice(0, 10);
    setImageList(totalImages);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageList((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const isValid = ImageList.length >= 10;

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      setLetterImages(ImageList);
      setLetterText(letterContent);

      // navigate(`/letter/preview`);

      // let segmentedText;
      // try {
      //   segmentedText = await segmentText(letterContent, textCount);
      //   console.log('AI가 생성한 글조각:', segmentedText);

      //   if (!Array.isArray(segmentedText)) {
      //     throw new Error('AI 응답이 배열이 아님');
      //   }

      //   // ✅ 길이 부족하면 빈 항목으로 채움
      //   if (segmentedText.length < textCount) {
      //     const missingCount = textCount - segmentedText.length;
      //     segmentedText = [...segmentedText, ...Array(missingCount).fill('')];
      //     console.warn(`AI 분할 수 부족. ${missingCount}개의 빈 항목으로 채움.`);
      //   } else if (segmentedText.length > textCount) {
      //     segmentedText = segmentedText.slice(0, textCount); // 혹시 넘쳤을 경우
      //   }
      // } catch (error) {
      //   console.warn('AI 문장 나누기 실패, fallback으로 줄바꿈 처리함:', error);
      //   segmentedText = splitTextBySentence(letterContent, textCount);

      //   if (segmentedText.length < textCount) {
      //     const missingCount = textCount - segmentedText.length;
      //     segmentedText = [...segmentedText, ...Array(missingCount).fill('')];
      //   }
      // }

      let segmentedText = splitTextBySentence(letterContent, textCount);

      navigate('/letter/preview', {
        state: {
          segmentedText,
        },
      });

      // const result = await submitPostcard(
      //   ImageList.map((img) => img.file),
      //   letterContent,
      // );

      // if (result?.key) {
      //   setRedisMessageKey(result.key);
      //   // console.log(result.key);
      //   const postcard = await getPostcard(result.key);

      //   navigate('/letter/preview', {
      //     state: {
      //       postcard,
      //       segmentedText,
      //     },
      //   });
      // }
    } finally {
      setIsLoading(false);
    }
  };

  const splitTextBySentence = (text, count) => {
    const sentences =
      text
        .match(/[^.!?]+[.!?]+(?:\s+|$)/g)
        ?.map((s) => s.trim())
        .filter((s) => s.length > 0) || [];

    const total = sentences.length;
    const baseSize = Math.floor(total / count);
    const remainder = total % count;

    const result = [];
    let index = 0;

    for (let i = 0; i < count; i++) {
      const groupSize = baseSize + (i < remainder ? 1 : 0);
      result.push(sentences.slice(index, index + groupSize).join(' '));
      index += groupSize;
    }

    return result;
  };

  return (
    <StLetterWritingWrapper>
      <Header headerName="편지쓰기" />
      <WritingContentWrapper>
        {isLoading && (
          <LoadingOverlay>
            <Spinner />
            <p>편지를 정리하고 있어요... 잠시만 기다려 주세요.</p>
          </LoadingOverlay>
        )}
        <ContentWrapper>
          <ImageHeader>
            <Text>이미지 업로드</Text>
            {!isValid ? <WarnText>사진은 10장 필요합니다.</WarnText> : <WarnText />}
          </ImageHeader>
          <ImagesWrapper>
            {ImageList.map((img, index) => (
              <ImagePreview key={index}>
                <PreviewImg src={img.url} alt={`uploaded-${index}`} />
                <RemoveBtn src={CircleClose} onClick={() => handleRemoveImage(index)} />
              </ImagePreview>
            ))}
            {ImageList.length < 10 && (
              <AddImageLabel>
                +
                <ImageInput
                  type="file"
                  accept="image/png, image/jpeg, image/heic"
                  multiple
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </AddImageLabel>
            )}
          </ImagesWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <Text>사랑하는 너에게</Text>
          <InputTextBox
            maxLength={600}
            value={letterContent}
            onChange={handleLetterChange}
            $fontStyle={userFont}
          />
          <FooterWrapper>
            <CharCount>{letterContent.length} / 600</CharCount>
            <SubmitButton disabled={!isValid} $isValid={isValid} onClick={handleSubmit}>
              입력완료
            </SubmitButton>
          </FooterWrapper>
        </ContentWrapper>
      </WritingContentWrapper>
    </StLetterWritingWrapper>
  );
};

export default LetterWriting;

const StLetterWritingWrapper = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.White};
`;

const WritingContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 8rem 3rem;
  gap: 2rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Text = styled.div`
  color: ${({ theme }) => theme.colors.MainRed};
  ${({ theme }) => theme.fonts.Title4};
`;

const ImagesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  gap: 0.5rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 5rem;
  height: 5rem;
  overflow: hidden;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveBtn = styled.img`
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
`;

const AddImageLabel = styled.label`
  width: 5rem;
  height: 5rem;
  box-sizing: border-box;
  border: 1px dashed ${({ theme }) => theme.colors.Orange1};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.Orange1};
  cursor: pointer;
`;

const ImageInput = styled.input`
  display: none;
`;

const InputTextBox = styled.textarea`
  width: 100%;
  height: 35rem;

  padding: 1rem;
  border: solid 1px ${({ theme }) => theme.colors.Orange1};
  border-radius: 0.75rem;
  outline: none;

  resize: none;
  overflow-y: auto;
  box-sizing: border-box;

  ${({ theme, $fontStyle }) => theme.fonts[$fontStyle]};
`;

const FooterWrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const WarnText = styled.p`
  color: ${({ theme }) => theme.colors.MainRed};
  ${({ theme }) => theme.fonts.Body4};
`;

const CharCount = styled.p`
  width: 6rem;
  color: ${({ theme }) => theme.colors.MainRed};
  ${({ theme }) => theme.fonts.Body3};
`;

const SubmitButton = styled.button`
  width: 7rem;
  height: 3rem;
  border-radius: 2rem;
  background-color: ${({ theme, $isValid }) => ($isValid ? theme.colors.Red2 : theme.colors.Gray4)};
  color: ${({ theme }) => theme.colors.White};
  ${({ theme }) => theme.fonts.Body3};
  cursor: ${({ $isValid }) => ($isValid ? 'pointer' : 'not-allowed')};
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    color: ${({ theme }) => theme.colors.Gray0};
    ${({ theme }) => theme.fonts.Body1};
    margin-top: 2rem;
  }
`;

const Spinner = styled.div`
  border: 0.4rem solid #eee;
  border-top: 0.4rem solid ${({ theme }) => theme.colors.MainRed};
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ImageHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
