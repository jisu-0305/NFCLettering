import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { IcBack, IcMenuSmall } from '../../assets/icons';
import CoinBirdImg from '../../assets/images/bird_coin.png';
import useModal from '../../hooks/common/useModal';
import ConfirmButton from './button/ConfirmButton';
import AlertModal from './modal/AlertModal';
import MenuModal from './modal/MenuModal';

const Header = ({ headerName, missBack, onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menu = useModal();
  const alarm = useModal();

  const target = location.pathname.includes('/dear') ? 'dear' : 'sender';

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleMenuClick = () => {
    menu.toggle();
  };

  return (
    <>
      <StHeaderWrapper $missBack={missBack}>
        <IcBack className="back" onClick={handleGoBack} />
        {headerName}
        <IcMenuSmall onClick={handleMenuClick} />
      </StHeaderWrapper>

      <StMenuModalWrapper $showing={menu.isShowing} onClick={menu.toggle}>
        {/* 클릭 전파 방지: 메뉴 누를 때 모달이 바로 닫히는 걸 막기 위해! */}
        <div onClick={(e) => e.stopPropagation()}>
          <MenuModal isShowing={menu.isShowing} target={target} alarm={alarm} />
        </div>
      </StMenuModalWrapper>

      <AlertModal
        title="키링을 구매한 뒤 편지를 써주세요."
        imgSrc={CoinBirdImg}
        isOpen={alarm.isShowing}
        onClose={alarm.toggle}
      >
        <ConfirmButton onClick={() => navigate(`/purchase`)} btnName="키링 구매하러 가기" />
      </AlertModal>
    </>
  );
};

export default Header;

const StHeaderWrapper = styled.button`
  position: fixed;
  top: 0;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  max-width: 38rem;
  padding: 4rem 2rem;

  color: ${({ theme }) => theme.colors.MainRed};
  ${({ theme }) => theme.fonts.MenuLogo};

  z-index: 10;

  .back {
    opacity: ${({ $missBack }) => ($missBack ? '0' : '1')};
  }
`;

const StMenuModalWrapper = styled.div`
  display: ${({ $showing }) => ($showing ? 'block' : 'none')};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 995;

  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);
`;
