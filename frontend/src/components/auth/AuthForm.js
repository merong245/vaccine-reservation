import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
import { ToggleButton, ToggleButtonGroup, Form } from 'react-bootstrap';
import DaumPostcode from '../../../node_modules/react-daum-postcode/lib/DaumPostcode';
import { StyledInput, InputBlock } from '../common/Input';
import { StyledBox, StyledClickBox } from '../common/Contents';

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

const AuthForm = ({
  type,
  form,
  onChange,
  onSubmit,
  error,
  handleSex,
  handleChangePhoneNum,
  handleChangeRegNum,
  handleChangeResidence,
}) => {
  const text = textMap[type];

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [viewAddress, setViewAddress] = useState(true);
  const [available, setAvailable] = useState(true);
  const [agreeContents, setAgreeContents] = useState(false);

  // 주민번호 변경 이벤트 핸들러
  const onChangeRegNumber = (e) => {
    const regex = /^[0-9\b -]{0,14}$/;
    if (regex.test(e.target.value)) {
      setRegistrationNumber(e.target.value);
    }
    onChange(e);
  };

  // 주민번호에 - 자동 삽입
  useEffect(() => {
    if (registrationNumber.length === 13) {
      setRegistrationNumber(
        registrationNumber.replace(/-/g, '').replace(/(\d{6})(\d{7})/, '$1-$2'),
      );
    }

    if (typeof handleChangeRegNum !== 'undefined') {
      handleChangeRegNum(registrationNumber);
    }
  }, [registrationNumber, handleChangeRegNum]);

  // 전화번호 변경 이벤트 핸들러
  const onChangePhoneNumber = (e) => {
    const regex = /^[0-9\b -]{0,13}$/;
    if (regex.test(e.target.value)) {
      setPhoneNumber(e.target.value);
    }
    onChange(e);
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

    if (typeof handleChangePhoneNum !== 'undefined') {
      handleChangePhoneNum(phoneNumber);
    }
  }, [phoneNumber, handleChangePhoneNum]);

  // 주소정보 검색 완료 이벤트 헨들러
  const handleComplete = (data) => {
    setAddress(data.sido + ' ' + data.sigungu);
    setViewAddress(true);
  };

  // 주소정보 삽입
  useEffect(() => {
    if (typeof handleChangeResidence !== 'undefined') {
      handleChangeResidence(address);
    }
  }, [address, handleChangeResidence]);

  // 약관 체크 이벤트 핸들러
  const handleCheck = () => {
    setAvailable(!available);
  };

  // 약관 내용 클릭 이벤트 핸들러
  const handleAgreeContents = () => {
    setAgreeContents(!agreeContents);
  };

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
                onChange={onChangeRegNumber}
                value={registrationNumber}
              />
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
              {viewAddress ? (
                <StyledBox
                  name="residence"
                  style={{ height: '3rem', overflow: 'hidden' }}
                >
                  {address === '' ? (
                    <div className="initial">거주지</div>
                  ) : (
                    address
                  )}
                  <StyledClickBox
                    onClick={() => {
                      setAddress('');
                      setViewAddress(!viewAddress);
                    }}
                  >
                    {address === '' ? '입력' : '수정'}
                  </StyledClickBox>
                </StyledBox>
              ) : (
                <DaumPostcode
                  onComplete={handleComplete}
                  autoClose={false}
                  style={{ height: 100 }}
                />
              )}
            </InputBlock>
            <InputBlock>
              <StyledBox style={{ height: '3rem' }}>
                <Form.Check
                  type="checkbox"
                  id="agreement"
                  label="약관동의"
                  onChange={handleCheck}
                />
                <StyledClickBox onClick={handleAgreeContents}>
                  약관보기
                </StyledClickBox>
              </StyledBox>
            </InputBlock>
            {
              /* 약관 내용 표시는 새 창을 띄우기 등으로 변경가능 */
              agreeContents && (
                <StyledBox style={{ marginTop: '-1px', fontSize: '11px' }}>
                  약관에 동의함으로서 회원가입 시 수집한 개인정보의 보관 및
                  이용에 동의함.
                </StyledBox>
              )
            }
          </>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonWithMarginTop
          cyan
          fullwidth="true"
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
