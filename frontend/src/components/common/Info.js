import styled from 'styled-components';
import palette from '../../lib/styles/palette';

export const InfoBlock = styled.div`
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  & + & {
    margin-top: 3rem;
  }
`;

export const InfoText = styled.div`
  font-size: 1.2rem;
  border-radius: 4px;
  border: 2px solid ${palette.cyan[7]};
  outline: none;
  padding: 1rem;
  width: 100%;
  align-items: center;
  text-align: center;
`;
