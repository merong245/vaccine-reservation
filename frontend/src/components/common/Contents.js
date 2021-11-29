import styled from 'styled-components';
import Responsive from '../common/Responsive';

export const ContentsBox = styled.div`
  flex-direction: row;
  display: flex;
`;

export const ContentsBlock = styled(Responsive)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  margin-top: 8rem;
  width: 600px;
`;

export const ItemBlock = styled.div`
  font-size: 1rem;
  display: flex;
  justify-content: center;
`;
