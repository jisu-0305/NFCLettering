import React, { useEffect } from 'react';
import styled from 'styled-components';

import { IcClose } from '../../../assets/icons';

const ConfirmModal = ({ isLanding, isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose} $isLanding={isLanding}>
      <StModalWrapper onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <IcClose style={{ cursor: 'pointer' }} />
        </CloseButton>
        <Title>{title}</Title>
        <Content>{children}</Content>
      </StModalWrapper>
    </Backdrop>
  );
};

export default ConfirmModal;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: ${({ $isLanding }) => ($isLanding ? 'white' : 'rgba(0, 0, 0, 0.3)')};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StModalWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 1.5rem;
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CloseButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 1rem;
  width: 90%;

  z-index: 1000;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.MainRed};
  ${({ theme }) => theme.fonts.Title2};
`;

const Content = styled.div`
  padding: 1.5rem;
  text-align: center;
  ${({ theme }) => theme.fonts.Body2};
`;
