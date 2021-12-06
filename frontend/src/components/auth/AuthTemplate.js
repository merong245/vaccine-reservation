import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

/**
 * 회원가입 / 로그인 페이지의 레이아웃을 담당하는 컴포넌트입니다.
 */

/* 화면 전체를 채움 */
const AuthTemplateBlock = styled.div`
  position: absolute;
  left: 0;
  top: 4rem;
  bottom: 0;
  right: 0;
  background: ${palette.gray[2]};
  /* flex로 내부 내용 중앙 정렬 */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* 흰색 박스 */
const WhiteBox = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 360px;
  background: white;
  border-radius: 2px;
`;

const AuthTemplate = ({ children, center }) => {
  return (
    <AuthTemplateBlock
      style={
        center
          ? {
              justifyContent: 'center',
            }
          : {}
      }
    >
      <WhiteBox
        style={
          !center
            ? {
                marginTop: '56px',
              }
            : {}
        }
      >
        {children}
      </WhiteBox>
    </AuthTemplateBlock>
  );
};

export default AuthTemplate;
