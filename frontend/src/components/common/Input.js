import styled from 'styled-components';
import palette from '../../lib/styles/palette';

/**
 * innput container
 */
export const InputBlock = styled.div`
  display: flex;
  & + & {
    margin-top: 1rem;
  }
`;

/**
 * styled input
 */
export const StyledInput = styled.input`
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid ${palette.gray[5]};
  outline: none;
  height: 3rem;
  width: 100%;
  padding: 1rem;
  &:focus {
    color: $oc-teal-7;
    border: 1px solid ${palette.gray[7]};
  }
`;
