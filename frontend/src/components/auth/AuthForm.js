import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
import { ToggleButton, ToggleButtonGroup, Form } from 'react-bootstrap';

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

/**
 * innput container
 */
const InputBlock = styled.div`
  display: flex;
  & + & {
    margin-top: 1rem;
  }
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  width: 100%;
`;

const StyledToggleButton = styled(ToggleButton)`
  height: 3rem;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
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
 * checkbox block
 */
const CheckboxBlcok = styled.label`
  font-size: 1rem;
  border: 1px solid ${palette.gray[5]};
  outline: none;
  height: 3rem;
  width: 100%;
  padding: 1rem;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  justify-content: center;
  -moz-box-align: center;
  -moz-box-pack: center;
  &:hover {
    color: $oc-teal-7;
    border: 1px solid ${palette.gray[6]};
    box-shadow: rgba(115, 128, 150, 0.2) 0px 1px 2px 0px inset;
  }
`;

/**
 * styled checkbox
 */
const StyledCheckbox = styled.input`
  height: 1px;
  border: 0px none;
  clip: rect(0px, 0px, 0px, 0px);
  position: absolute;
  width: 1px;
  margin: -1px;
  padding: 0px;
  overflow: hidden;
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

const AuthForm = ({ type, form, onChange, onSubmit, error, handleSex }) => {
  const text = textMap[type];

  const [phoneNumber, setPhoneNumber] = useState('');
  const [available, setAvailable] = useState(true);

  // 전화번호 변경 이벤트 핸들러
  const onChangePhoneNumber = (e) => {
    const regex = /^[0-9\b -]{0,13}$/;
    if (regex.test(e.target.value)) {
      setPhoneNumber(e.target.value);
    }
    onChange(e);
  };

  // 약관 체크 이벤트 핸들러
  const handleCheck = () => {
    setAvailable(!available);
  };

  // 전화번호에 - 자동 삽입
  useEffect(() => {
    if (phoneNumber.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
    }
    if (phoneNumber.length === 13) {
      setPhoneNumber(
        phoneNumber
          .replace(/-/g, '')
          .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
      );
    }
  }, [phoneNumber]);

  return (
    <AuthFormBlock>
      <h3>{text}</h3>
      <form onSubmit={onSubmit}>
        <InputBlock>
          <StyledInput
            autoComplete="id"
            name="id"
            placeholder="아이디"
            onChange={onChange}
            value={form.id}
          />
        </InputBlock>
        <InputBlock>
          <StyledInput
            autoComplete="new-password"
            name="password"
            placeholder="비밀번호"
            type="password"
            onChange={onChange}
            value={form.password}
          />
        </InputBlock>
        {type === 'register' && (
          <>
            <InputBlock>
              <StyledInput
                autoComplete="new-password"
                name="passwordConfirm"
                placeholder="비밀번호 확인"
                type="password"
                onChange={onChange}
                value={form.passwordConfirm}
              />
            </InputBlock>
            <InputBlock>
              <StyledInput
                name="name"
                placeholder="이름"
                onChange={onChange}
                value={form.name}
              />
            </InputBlock>
            <InputBlock>
              <StyledInput
                name="registration_number"
                placeholder="주민번호"
                type="registration_number"
                onChange={onChange}
                value={form.registration_number}
              />
              {/* // </InputBlcok>
            // <InputBlcok>
            //   <StyledInput
            //     name="age"
            //     placeholder="나이"
            //     type="number"
            //     min="1"
            //     max="150"
            //     onChange={onChange}
            //     value={form.age}
            //     style={{ width: '50%' }}
            //   />
            //   <div
            //     style={{
            //       width: '50%',
            //       height: '3rem',
            //       display: 'flex',
            //       alignItems: 'center',
            //       paddingLeft: '6px',
            //     }}
            //   >
            //     <CheckboxBlcok
            //       style={
            //         checkedGender === 'M'
            //           ? {
            //               borderTopLeftRadius: '4px',
            //               borderBottomLeftRadius: '4px',
            //               backgroundColor: palette.gray[3],
            //             }
            //           : {
            //               borderTopLeftRadius: '4px',
            //               borderBottomLeftRadius: '4px',
            //               backgroundColor: '#ffffff',
            //             }
            //       }
            //     >
            //       <StyledCheckbox
            //         name="sex"
            //         type="checkbox"
            //         aria-label="남"
            //         onClick={genderClick}
            //         onChange={onChange}
            //         value="M"
            //         style={{ width: '50%' }}
            //       />
            //       <span style={{}}>남</span>
            //     </CheckboxBlcok>
            //     <CheckboxBlcok
            //       style={
            //         checkedGender === 'F'
            //           ? {
            //               borderTopRightRadius: '4px',
            //               borderBottomRightRadius: '4px',
            //               backgroundColor: palette.gray[3],
            //             }
            //           : {
            //               borderTopRightRadius: '4px',
            //               borderBottomRightRadius: '4px',
            //               backgroundColor: '#ffffff',
            //             }
            //       }
            //     >
            //       <StyledCheckbox
            //         name="sex"
            //         type="checkbox"
            //         aria-label="여"
            //         onClick={genderClick}
            //         onChange={onChange}
            //         value="F"
            //         style={{ width: '50%' }}
            //       />
            //       <span style={{}}>여</span>
            //     </CheckboxBlcok>
            //   </div>
            // </InputBlcok>
            // <InputBlcok> */}
            </InputBlock>
            {/* 나이는 주민번호로 계산 */}
            <InputBlock>
              <StyledToggleButtonGroup name="sex" onChange={handleSex}>
                <StyledToggleButton id="male" variant="outline-info" value="M">
                  Male
                </StyledToggleButton>
                <StyledToggleButton
                  id="female"
                  variant="outline-info"
                  value="F"
                >
                  Female
                </StyledToggleButton>
              </StyledToggleButtonGroup>
            </InputBlock>
            <InputBlock>
              <StyledInput
                name="phone_number"
                placeholder="휴대전화 번호"
                onChange={onChangePhoneNumber}
                value={phoneNumber}
              />
            </InputBlock>
            <InputBlock>
              <StyledInput
                name="residence"
                placeholder="거주지역"
                onChange={onChange}
                value={form.residence}
              />
            </InputBlock>
            <InputBlock>
              <Form.Check
                type="checkbox"
                id="agreement"
                label="약관동의"
                onChange={handleCheck}
              />
            </InputBlock>
          </>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonWithMarginTop
          cyan
          fullWidth
          style={{ marginTop: '1rem' }}
          disabled={type === 'register' ? available : false}
        >
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
