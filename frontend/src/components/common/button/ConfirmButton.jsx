import styled from 'styled-components';

const ConfirmButton = ({ onClick, btnName }) => {
  return <StConfirmButtonWrapper onClick={onClick}>{btnName}</StConfirmButtonWrapper>;
};

export default ConfirmButton;

const StConfirmButtonWrapper = styled.button`
  width: 100%;
  min-width: fit-content;
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.Red2};
  ${({ theme }) => theme.fonts.Title4};
  color: ${({ theme }) => theme.colors.White};
  border: none;
`;
