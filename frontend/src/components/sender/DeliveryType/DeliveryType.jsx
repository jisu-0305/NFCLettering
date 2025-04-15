import { format } from 'date-fns';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import styled from 'styled-components';

import { sendLetter } from '../../../apis/letter';
import { sendPostcard } from '../../../apis/postcard';
import IconLetter from '../../../assets/images/sender/NormalOption.png';
import IconTimer from '../../../assets/images/sender/OpenTimerOption.png';
import IconCalendar from '../../../assets/images/sender/ScheduledOption.png';
import IconLock from '../../../assets/images/sender/SecretOption.png';
import {
  LetterImageList,
  LetterTextList,
  PostcardImage,
  PostcardImageFile,
  PostcardText,
  SelectedKeyringId,
} from '../../../recoil/atom';
import Header from '../../common/Header';
import QuestionText from '../SelectDear/QuestionText';
import DeliveryTypeCard from './DeliveryTypeCard';
import ScheduledOption from './ScheduledOption';
import SecretOption from './SecretOption';
import TimerOption from './TimerOption';

const DeliveryType = () => {
  const navigate = useNavigate();

  const selectedKeyringId = useRecoilValue(SelectedKeyringId);
  const postcardImageFile = useRecoilValue(PostcardImageFile);
  const postcardText = useRecoilValue(PostcardText);
  const letterTextList = useRecoilValue(LetterTextList);
  const letterImageList = useRecoilValue(LetterImageList);

  const resetLetterTextList = useResetRecoilState(LetterTextList);
  const resetLetterImageList = useResetRecoilState(LetterImageList);
  const resetPostcardText = useResetRecoilState(PostcardText);
  const resetPostcardImageFile = useResetRecoilState(PostcardImageFile);
  const resetPostcardImage = useResetRecoilState(PostcardImage);

  const [selectedModalType, setSelectedModalType] = useState(null);

  const deliveryTypes = [
    {
      icon: IconLetter,
      title: '일반 편지',
      description: '바로 전송됩니다!',
      value: 'NONE',
    },
    {
      icon: IconTimer,
      title: '오픈 타이머',
      description: '타이머가 종료되어야 열릴 수 있어요!',
      value: 'TIMECAPSULE',
    },
    {
      icon: IconLock,
      title: '비밀 편지',
      description: '내가 낸 퀴즈를 맞혀야 편지가 열려요!',
      value: 'SECRETTYPE',
    },
    {
      icon: IconCalendar,
      title: '예약 편지',
      description: '예약된 날짜 및 시간에 발송합니다!',
      value: 'RESERVATION',
    },
  ];

  const postLetter = async (letterData) => {
    sendLetter(letterData, letterImageList)
      .then(() => {
        resetLetterTextList();
        resetLetterImageList();
        // 성공 처리
      })
      .catch((error) => {
        console.error('편지 전송 실패:', error);
        alert('편지 전송을 실패했어요.');
      });

    const firstImageURL =
      letterImageList.length > 0 ? URL.createObjectURL(letterImageList[0].file) : null;

    if (letterData.sealingWaxId === 2) {
      navigate(`/complete/letter`, { state: { firstImageURL } });
    } else {
      navigate(`/complete/letter/congrats`, { state: { firstImageURL } });
    }
  };

  const postPostcard = async (postcardData) => {
    sendPostcard({
      postcardData,
      imageFile: postcardImageFile,
    })
      .then(() => {
        // 성공 처리
        resetPostcardText();
        resetPostcardImageFile();
        resetPostcardImage();
      })
      .catch((error) => {
        console.error('엽서 전송 실패:', error);
        alert('엽서 전송을 실패했어요.');
      });

    const firstImageURL = postcardImageFile ? URL.createObjectURL(postcardImageFile) : null;

    if (postcardData.sealingWaxId === 1) {
      navigate(`/complete/postcard`, { state: { firstImageURL } });
    } else {
      navigate(`/complete/postcard/ssafy`, { state: { firstImageURL } });
    }
  };

  // 전송 공통 로직 (NORMAL, SCHEDULED에서 사용)
  const handleSend = async ({ conditionType, scheduledAt = null, secret = {} }) => {
    const sealingWaxId = localStorage.getItem('sealingWaxId');
    if (!sealingWaxId) {
      alert('실링왁스 ID가 없습니다.');
      return;
    }

    if (sealingWaxId == 1 || sealingWaxId == 4) {
      //엽서
      const postcardData = {
        keyringId: selectedKeyringId,
        sealingWaxId: Number(sealingWaxId),
        conditionType,
        conditionTime: scheduledAt ? format(scheduledAt, "yyyy-MM-dd'T'HH:mm:ss") : null,
        content: postcardText,
        quizQuestion: secret.question,
        quizHint: secret.hint,
        quizAnswer: secret.answer,
      };

      postPostcard(postcardData);
    } else {
      //편지
      const letterData = {
        keyringId: selectedKeyringId,
        sealingWaxId: Number(sealingWaxId),
        conditionType,
        conditionTime: scheduledAt ? format(scheduledAt, "yyyy-MM-dd'T'HH:mm:ss") : null,
        contents: letterTextList,
      };

      postLetter(letterData);
    }
  };

  // 카드 클릭 시 처리
  const handleSelect = (type) => {
    if (type === 'NONE') {
      handleSend({ conditionType: 'NONE' });
    } else if (type === 'RESERVATION' || type === 'TIMECAPSULE' || type === 'SECRETTYPE') {
      setSelectedModalType(type);
    } else {
      alert('해당 전송 방식은 준비 중입니다.');
    }
  };

  return (
    <Wrapper>
      <Header headerName="전송유형 선택" />
      <QuestionTextWrapper>
        <QuestionText text="전송 방식을 선택해주세요!" />
      </QuestionTextWrapper>

      <CardList>
        {deliveryTypes.map((type) => (
          <DeliveryTypeCard
            key={type.value}
            icon={type.icon}
            title={type.title}
            description={type.description}
            onClick={() => handleSelect(type.value)}
          />
        ))}
      </CardList>

      {/* ✅ 예약 편지 모달 렌더링 */}
      {selectedModalType === 'RESERVATION' && (
        <ScheduledOption
          onClose={() => setSelectedModalType(null)}
          onConfirm={(datetime) =>
            handleSend({
              conditionType: 'RESERVATION',
              scheduledAt: datetime,
            })
          }
        />
      )}
      {selectedModalType === 'TIMECAPSULE' && (
        <TimerOption
          onClose={() => setSelectedModalType(null)}
          onConfirm={(datetime) => {
            handleSend({
              conditionType: 'TIMECAPSULE',
              scheduledAt: datetime,
            });
          }}
        />
      )}
      {selectedModalType === 'SECRETTYPE' && (
        <SecretOption
          onClose={() => setSelectedModalType(null)}
          onConfirm={(secret) => handleSend({ conditionType: 'SECRETTYPE', secret })}
        />
      )}
    </Wrapper>
  );
};

export default DeliveryType;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: auto;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
`;

const QuestionTextWrapper = styled.div`
  margin-top: 10rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
`;
