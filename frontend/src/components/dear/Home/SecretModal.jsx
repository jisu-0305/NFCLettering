import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import LockIcon from '/src/assets/images/sender/SecretOption.png'; // 🔒 자물쇠 이미지

import ConfirmButton from '../../common/button/ConfirmButton';
import ConfirmModal from '../../common/modal/ConfirmModal';

export default function SecretModal({
  isLanding,
  question,
  hint,
  correctAnswer,
  onSuccess,
  onClose,
}) {
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  const handleCheckAnswer = () => {
    if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setError('');
      onSuccess(); // 정답 맞춤 처리
    } else {
      setError('정답이 아닙니다!');
    }
  };

  return (
    <ConfirmModal
      isLanding={isLanding}
      isOpen={true}
      onClose={onClose}
      title={
        <ModalTitleBox>
          <ModalTitle>비밀편지 도착</ModalTitle>
          <ModalSub>퀴즈를 맞추면 편지를 열 수 있어요!</ModalSub>
        </ModalTitleBox>
      }
    >
      <ModalContent>
        <LockImage src={LockIcon} alt="자물쇠 이미지" />
        <QuestionText>{question}</QuestionText>
        {hint !== undefined && <HintText>힌트 : {hint?.trim() ? hint : '없음'}</HintText>}
        <AnswerInput
          placeholder="정답을 입력해주세요."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        {error && <ErrorText>{error}</ErrorText>}

        <ButtonWrapper>
          <ConfirmButton btnName="완료" onClick={handleCheckAnswer} />
        </ButtonWrapper>
      </ModalContent>
    </ConfirmModal>
  );
}
const ModalTitleBox = styled.div`
  text-align: center;
`;

const ModalTitle = styled.div`
  ${({ theme }) => theme.fonts.Title2};
  color: ${({ theme }) => theme.colors.MainRed};
`;

const ModalSub = styled.div`
  ${({ theme }) => theme.fonts.body2};
  color: ${({ theme }) => theme.colors.Gray2};
  white-space: pre-line;
  text-align: center;
  font-size: 1.3rem;
  margin-top: 0.8rem;
  /* margin-bottom: 1rem; */
`;

// const ModalContent = styled.div`
//   text-align: center;
//   min-height: 30rem;
//   /* padding-top: 1rem; */
// `;
const ModalContent = styled.div`
  text-align: center;
  max-width: 30rem; /* ✅ 최대 너비 제한 */
  width: 90%;
  margin: 0 auto;
`;

const LockImage = styled.img`
  width: 50% !important;
  height: auto;
  margin: 1rem auto;
`;

const QuestionText = styled.div`
  ${({ theme }) => theme.fonts.Saeum3};
  color: ${({ theme }) => theme.colors.MainRed};
  margin: 1rem 0 0.6rem;
`;

const HintText = styled.div`
  ${({ theme }) => theme.fonts.Saeum5};
  color: ${({ theme }) => theme.colors.Gray2};
  margin-bottom: 1.8rem;
  text-align: center;
`;

const AnswerInput = styled.input`
  justify-content: center;
  max-width: 22rem;
  padding: 1.2rem;
  border-radius: 1.8rem;
  background-color: ${({ theme }) => theme.colors.Gray7};
  border: none;
  color: ${({ theme }) => theme.colors.Gray1};
  ${({ theme }) => theme.fonts.body2};
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.MainRed};
  ${({ theme }) => theme.fonts.body2};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const ButtonWrapper = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
`;
