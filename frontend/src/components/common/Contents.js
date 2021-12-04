import styled, { css } from 'styled-components';
import Responsive from '../common/Responsive';
import palette from '../../lib/styles/palette';

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

/**
 * styled box
 */
export const StyledBox = styled.div`
  .initial {
    color: #777777;
  }
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid ${palette.gray[5]};
  outline: none;
  width: 100%;
  padding: 1rem;
  align-items: center;
  justify-content: space-between;
  display: flex;
  &:focus {
    color: $oc-teal-7;
    border: 1px solid ${palette.gray[7]};
  }
`;

/**
 * styled click box
 * 약관보기
 */
export const StyledClickBox = styled.div`
  font-size: 0.8rem;
  color: ${palette.gray[5]};
  user-select: none;
  &:hover {
    color: ${palette.gray[7]};
  }
`;
