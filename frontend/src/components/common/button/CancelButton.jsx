import styled from 'styled-components';

const CancelButton = ({ onClick, btnName }) => {
  return <StCancelButton onClick={onClick}>{btnName}</StCancelButton>;
};

export default CancelButton;

const StCancelButton = styled.button`
  width: 100%;
  min-width: fit-content;
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.Gray6};
  color: ${({ theme }) => theme.colors.Gray2};
  ${({ theme }) => theme.fonts.Title4};
  border: none;
`;
