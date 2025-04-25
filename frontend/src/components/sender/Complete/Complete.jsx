import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import PaperBackground from '/src/assets/background2.png';
import CompleteImage from '/src/assets/images/sender/TransmissionComplete.png';

import { deletePostcard } from '../../../apis/fastapi';
import { RedisMessageKey } from '../../../recoil/atom';
import LongButton from '../../common/button/LongButton';
import Header from '../../common/Header';

const Complete = () => {
  // const key = useRecoilValue(RedisMessageKey);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const autoDelete = async () => {
  //     try {
  //       const result = await deletePostcard(key);
  //       console.log(`🗑️ 삭제 성공: ${result.key}`);
  //     } catch (error) {
  //       console.warn(`삭제 실패: ${error.error || error}`);
  //     }
  //   };

  //   if (key) {
  //     autoDelete();
  //   }
  // }, [key]);

  return (
    <CompleteWrapper $Background={PaperBackground}>
      <Header headerName="편지 전송" missBack={true} />
      <img src={CompleteImage} alt="전송 완료 이미지" />
      <CompleteText>전송 완료!!</CompleteText>
      <SubText>키링을 태그하면 도착한 편지를 바로 확인할 수 있어요!</SubText>
      <LongButton
        btnName="보낸 편지함으로 가기"
        onClick={() => navigate(`/mailbox`, { state: 'send' })}
      />
    </CompleteWrapper>
  );
};

export default Complete;

const CompleteWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${({ $Background }) => $Background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 2rem;
  box-sizing: border-box;

  img {
    width: 50%;
    max-width: 24rem;
    margin-bottom: 2.5rem;
  }
`;

const CompleteText = styled.div`
  color: ${({ theme }) => theme.colors.Gray1};
  ${({ theme }) => theme.fonts.Saeum0};
  margin-bottom: 1rem;
`;

const SubText = styled.div`
  color: ${({ theme }) => theme.colors.Gray4};
  ${({ theme }) => theme.fonts.Body2};
  text-align: center;

  margin-bottom: 3rem;
`;
