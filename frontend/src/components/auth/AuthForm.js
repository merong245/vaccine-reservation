import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';

/**
 * login form
 */

const AuthFormBlock = styled.div`
  h3 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem;
  }
`;

const InputBlcok = styled.div`
  display: flex;
  & + & {
    margin-top: 1rem;
  }
`;

/**
 * styled input
 */
const StyledInput = styled.input`
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

/**
 * 폼 하단의 로그인/회원가입 링크
 */
const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    &:hover {
      color: ${palette.gray[9]};
    }
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

const textMap = {
  login: '로그인',
  register: '회원가입',
};

/**
 * 에러
 */
const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const AuthForm = ({ type, form, onChange, onSubmit, error }) => {
  const text = textMap[type];
  return (
    <AuthFormBlock>
      <h3>{text}</h3>
      <form onSubmit={onSubmit}>
        <InputBlcok>
          <StyledInput
            autoComplete="id"
            name="id"
            placeholder="아이디"
            onChange={onChange}
            value={form.id}
          />
        </InputBlcok>
        <InputBlcok>
          <StyledInput
            autoComplete="new-password"
            name="password"
            placeholder="비밀번호"
            type="password"
            onChange={onChange}
            value={form.password}
          />
        </InputBlcok>
        {type === 'register' && (
          <>
            <InputBlcok>
              <StyledInput
                autoComplete="new-password"
                name="passwordConfirm"
                placeholder="비밀번호 확인"
                type="password"
                onChange={onChange}
                value={form.passwordConfirm}
              />
            </InputBlcok>
            <InputBlcok>
              <StyledInput
                name="name"
                placeholder="이름"
                onChange={onChange}
                value={form.name}
              />
            </InputBlcok>
            <InputBlcok>
              <StyledInput
                name="registration_number"
                placeholder="주민번호"
                type="registration_number"
                onChange={onChange}
                value={form.registration_number}
              />
            </InputBlcok>
            <InputBlcok>
              <StyledInput
                name="age"
                placeholder="나이"
                type="number"
                min="1"
                max="150"
                onChange={onChange}
                value={form.age}
                style={{ width: '50%' }}
              />
              <InputBlcok style={{ width: '50%' }}>
                <StyledInput
                  name="sex"
                  type="checkbox"
                  onSelect={onChange}
                  value="M"
                  style={{ width: '50%' }}
                />
                <StyledInput
                  name="sex"
                  type="checkbox"
                  onChange={onChange}
                  value="F"
                  style={{ width: '50%', display: 'flex' }}
                />
              </InputBlcok>
            </InputBlcok>
            <InputBlcok>
              <StyledInput
                name="phone_number"
                placeholder="휴대전화 번호"
                onChange={onChange}
                value={form.phone_number}
              />
            </InputBlcok>
            <InputBlcok>
              <StyledInput
                name="residence"
                placeholder="거주지역"
                onChange={onChange}
                value={form.residence}
              />
            </InputBlcok>
            <InputBlcok>
              <StyledInput
                name="terms"
                placeholder="약관동의"
                onChange={onChange}
                value={form.terms}
              />
            </InputBlcok>
          </>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonWithMarginTop cyan fullWidth style={{ marginTop: '1rem' }}>
          {text}
        </ButtonWithMarginTop>
      </form>
      <Footer>
        {type === 'login' ? (
          <Link to="/register">회원가입</Link>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </Footer>
    </AuthFormBlock>
  );
};

export default AuthForm;
