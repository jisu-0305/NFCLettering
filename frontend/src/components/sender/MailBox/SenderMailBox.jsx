import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getFilterInfo } from '../../../apis/mailbox';
import Header from '../../common/Header';
import CenterCarousel from './CenterCarousel';

const SenderMailBox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [dearList, setDearList] = useState(null);
  const [selectedDear, setSelectedDear] = useState('ALL');

  const fetchFilterList = async () => {
    const res = await getFilterInfo();
    const { keyringFilterResponse } = res || {};

    if (keyringFilterResponse) {
      const allButton = { keyringId: 'ALL', nfcName: 'ALL' };
      setDearList([allButton, ...keyringFilterResponse]);
    }
  };

  const handleGoBack = () => {
    if (state === 'send') {
      navigate(`/home`);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    fetchFilterList();
  }, []);

  return (
    <>
      <StListWrapper>
        <Header headerName="보낸 편지함" onBack={handleGoBack} />
        <StContentWrapper>
          <FilterOptions>
            {dearList &&
              dearList.map((dear) => {
                const { keyringId, nfcName } = dear;

                return (
                  <FilterButton
                    key={keyringId}
                    $isSelected={selectedDear === keyringId}
                    onClick={() => setSelectedDear(keyringId)}
                  >
                    {nfcName}
                  </FilterButton>
                );
              })}
          </FilterOptions>
          <CenterCarousel selected={selectedDear} />
        </StContentWrapper>
      </StListWrapper>
    </>
  );
};

export default SenderMailBox;

const StListWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const StContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  box-sizing: border-box;
  height: 100%;
  padding: 0 2rem;
  padding-right: 0;
  padding-top: 7rem;

  color: ${({ theme }) => theme.colors.MainRed};
  ${({ theme }) => theme.fonts.TitleLogo};

  overflow: hidden;

  img {
    width: 100%;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.7rem;

  width: 100%;
  margin-bottom: 5rem;
  padding: 1rem 0;
  padding-right: 3rem;

  overflow-x: scroll;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button`
  width: fit-content;
  padding: 0.6rem 1rem;
  flex-shrink: 0;

  background-color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.MainRed : 'transparent'};
  color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.White : theme.colors.Gray0)};
  ${({ theme }) => theme.fonts.Body3};

  border-radius: 1.5rem;
  border: 1.5px solid ${({ theme }) => theme.colors.MainRed};

  z-index: 10;
`;
