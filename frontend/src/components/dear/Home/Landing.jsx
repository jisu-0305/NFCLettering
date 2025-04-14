import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getHighImage, getQuizInfo, getUnreadMessage } from '/src/apis/dear';
import { getLetterDetail } from '/src/apis/letter';
import { getPostcardDetail } from '/src/apis/postcard';

import { getCustomMessage } from '../../../apis/dear';
import OBJViewer from './OBJViewer';
import SecretModal from './SecretModal';

const Landing = () => {
  const navigate = useNavigate();

  const [newLetter, setNewLetter] = useState(false);
  const [messageInfo, setMessageInfo] = useState(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [lockedData, setLockedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCustomMessage();
      await fetchUnreadMessage();
    };

    fetchData();
  }, []);

  const fetchCustomMessage = async () => {
    try {
      const data = await getCustomMessage();
      setText(data.customMessage ?? '새로운 메세지가 도착했어요!');
    } catch (err) {
      console.error('[getCustomMessage 실패]', err);
      setText('새로운 메세지가 도착했어요!');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadMessage = async () => {
    try {
      const data = await getUnreadMessage();

      if (data?.exist) {
        // if (data.conditionType === 'SECRETTYPE') {
        //   const quiz = await getQuizInfo(data.messageId);
        //   setLockedData({
        //     ...quiz,
        //     messageId: data.messageId,
        //     designType: data.designType,
        //   });
        // } else {
        setMessageInfo(data);
        setNewLetter(true);
        // }
      } else {
        console.log('[📭 새 편지가 없습니다]');
      }
    } catch (e) {
      console.error('[getUnreadMessage 실패]', e);
    }
  };

  const handleSuccessUnlock = async () => {
    const detail =
      lockedData.designType === 'POSTCARD'
        ? await getPostcardDetail(lockedData.messageId)
        : await getLetterDetail(lockedData.messageId);

    const { id: messageId, sealingWaxId } = detail;
    setMessageInfo({ messageId, sealingWaxId });

    setNewLetter(true);
    setLockedData(null); // 모달 닫기
  };

  const handleNewLetterClick = async () => {
    if (!messageInfo) return;

    if (messageInfo.conditionType === 'SECRETTYPE') {
      const quiz = await getQuizInfo(messageInfo.messageId);
      setLockedData({
        ...quiz,
        messageId: messageInfo.messageId,
        designType: messageInfo.designType,
      });
      return;
    }

    const { messageId, sealingWaxId } = messageInfo;

    if (sealingWaxId === 1) {
      navigate(`/dear/postcard/${messageId}`, {
        state: { imageUrl },
      });
    } else if (sealingWaxId === 2) {
      navigate(`/dear/letter/${messageId}`, {
        state: { imageUrl },
      });
    } else if (sealingWaxId === 3) {
      navigate(`/dear/letter/congrats/${messageId}`, {
        state: { imageUrl },
      });
    } else if (sealingWaxId === 4) {
      navigate(`/dear/postcard/ssafy/${messageId}`, {
        state: { imageUrl },
      });
    } else {
      navigate('/dear/home');
    }
  };

  const handleMissedClick = () => {
    navigate('/dear/home');
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!messageInfo?.messageId) return;
      const data = await getHighImage(messageInfo.messageId);
      if (data?.imageHighUrl) {
        setImageUrl(data.imageHighUrl);
      }
    };

    fetchImage();
  }, [messageInfo]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {lockedData && (
        <SecretModal
          isLanding={true}
          question={lockedData.quizQuestion}
          hint={lockedData.quizHint}
          correctAnswer={lockedData.quizAnswer}
          onSuccess={handleSuccessUnlock}
          onClose={() => {
            navigate(`/dear/mailbox`);
          }}
        />
      )}

      <StHomeWrapper>
        <div>
          <OBJViewer
            objPath="/models/postbox.obj"
            mtlPath="/models/postbox.mtl"
            envelopeObjPath="/models/envelope.obj"
            envelopeMtlPath="/models/envelope.mtl"
            newLetter={newLetter}
            onMissedClick={newLetter ? handleNewLetterClick : handleMissedClick}
            text={text}
            isLocked={!!lockedData} // 모달이 떠있을 땐 자동 이동 방지
          />
        </div>
      </StHomeWrapper>
    </>
  );
};

export default Landing;

const StHomeWrapper = styled.div`
  background-color: white;
`;
