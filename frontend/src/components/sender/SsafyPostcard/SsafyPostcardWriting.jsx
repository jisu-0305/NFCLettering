import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { getUserFont } from '/src/apis/user';
import { getFontStyle } from '/src/util/getFont';

import { IcImageUpload, IcImageUploadTrue } from '../../../assets/icons';
import PostcardImg from '../../../assets/images/ssafyPostcard/postcard.png';
import { PostcardImage, PostcardImageFile, PostcardText } from '../../../recoil/atom';
import { convertHeicToJpeg } from '../../../util/convertHeicToJpeg';
import LongButton from '../../common/button/LongButton';
import Header from '../../common/Header';

const PostcardWriting = () => {
  const navigate = useNavigate();

  const [image, setImage] = useRecoilState(PostcardImage);
  const [imageFile, setImageFile] = useRecoilState(PostcardImageFile);
  const [text, setText] = useRecoilState(PostcardText);
  const [check, setCheck] = useState(false);
  const [userFont, setUserFont] = useState(undefined);

  const fileInputRef = useRef(null);
  const textLimit = 150;

  useEffect(() => {
    const fetchFont = async () => {
      const { font } = await getUserFont();
      setUserFont(getFontStyle(font));
    };

    fetchFont();
  }, []);

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= textLimit) {
      setText(value);
    }
    if (value.length == 0) {
      setCheck(false);
    }
  };

  // 이미지 업로드 핸들러
  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('4MB가 넘습니다!');
      event.target.type = '';
      event.target.type = 'file';
      return;
    }

    let finalFile = file;

    if (file.name.endsWith('.heic') || file.name.endsWith('.HEIC')) {
      // HEIC 이미지 처리
      const newFile = await convertHeicToJpeg(file);
      if (newFile) {
        finalFile = newFile;
      }
    }

    // ✅ WebP 변환
    const webpDataUrl = await convertImageFileToWebP(finalFile);

    if (webpDataUrl) {
      const webpBlob = dataURLtoBlob(webpDataUrl);

      setImageFile(new File([webpBlob], `letterring_${Date.now()}.webp`, { type: 'image/webp' }));
      setImage(webpDataUrl);
    }
  };

  // 파일을 WebP로 변환하는 유틸
  const convertImageFileToWebP = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const webpDataUrl = canvas.toDataURL('image/webp', 0.8); // 80% 품질
          resolve(webpDataUrl);
        };
      };
    });
  };

  // Base64를 Blob으로 변환하는 유틸
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (image != null && imageFile != null && text != '') {
      setCheck(true);
    }
  }, [image, imageFile, text]);

  return (
    <StPageWrapper>
      <Header headerName="엽서 쓰기" />

      <StContentWrapper>
        {/* 이미지 업로드 박스 */}
        <StUploadBox>
          <ImageUpload
            onClick={triggerFileInput}
            $isImage={image ? true : false}
            style={{ backgroundImage: `url(${image})` }}
          >
            <input
              type="file"
              accept="image/png, image/jpeg, image/heic, image/webp"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            {image ? <IcImageUploadTrue /> : <IcImageUpload />}
            {image ? <h3>사진 재업로드하기</h3> : <h3>사진 업로드하기</h3>}
            <p>PNG, JPG 형식만 지원됩니다.</p>
          </ImageUpload>
        </StUploadBox>

        {/* 엽서 뒷면 텍스트 박스 */}
        <StTextBox>
          <StTextArea
            value={text}
            $font={userFont}
            onChange={handleTextChange}
            maxLength={textLimit}
            placeholder="내용을 입력해주세요"
          />
          <StCharacterCount>
            {text.length} / {textLimit}
          </StCharacterCount>
        </StTextBox>
      </StContentWrapper>

      <StButtonWrapper>
        <LongButton
          onClick={() => navigate('/postcard/preview/ssafy')}
          btnName="엽서 작성 완료하기"
          disabled={check === false}
        />
      </StButtonWrapper>
    </StPageWrapper>
  );
};

export default PostcardWriting;

const StPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* height: 100%; */
  padding: 2rem;
  padding-top: 12rem;
`;

const StContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-bottom: 4rem;
`;

const StUploadBox = styled.div`
  width: 28rem;
  height: 20rem;
  border: 0.1rem solid #ccc;
  padding: 1rem;
  background-color: white;
`;

const ImageUpload = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 1rem;

  width: 100%;
  height: 100%;
  position: relative;

  background-color: #ececec;
  background-image: ${({ $imageUrl }) => ($imageUrl ? `url(${$imageUrl})` : 'none')};
  background-size: cover;
  background-position: center;
  border-radius: 0;

  cursor: pointer;

  ${({ $isImage }) =>
    $isImage &&
    `
    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 0 0 1rem 1rem;
      z-index: 2;
    }
  `}

  svg {
    z-index: 3;
  }

  h3 {
    z-index: 1;

    color: ${({ theme, $isImage }) => ($isImage ? theme.colors.White : theme.colors.Gray0)};
    ${({ theme }) => theme.fonts.Title4};
    z-index: 3;
  }

  p {
    z-index: 1;
    color: ${({ theme, $isImage }) => ($isImage ? theme.colors.White : '#464656')};
    ${({ theme }) => theme.fonts.Body4};
    z-index: 3;
  }
`;

const StTextBox = styled.div`
  width: 30rem;
  height: 23rem;
  background-image: url(${PostcardImg});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StTextArea = styled.textarea`
  ${({ theme, $font }) => theme.fonts[$font]};
  text-align: center;

  width: 24rem;
  height: 12rem;
  padding: 1rem;

  border-radius: 0.8rem;
  border: none;
  outline: none;
  resize: none;
  min-height: 5rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.Gray0};
  }

  &:focus::placeholder {
    opacity: 0;
  }
`;

const StCharacterCount = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.Gray0};
`;

const StButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30rem;
`;
