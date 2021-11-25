import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, register } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../modules/user';
import { withRouter } from 'react-router-dom';

const RegisterForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  // 인풋 변경 이벤트 핸들러
  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: 'register',
        key: name,
        value,
      }),
    );
  };

  const handleSex = (value) => {
    dispatch(
      changeField({
        form: 'register',
        key: 'sex',
        value,
      }),
    );
  };

  const handleChangeRegNum = (value) => {
    dispatch(
      changeField({
        form: 'register',
        key: 'registration_number',
        value,
      }),
    );
  };
  const handleChangePhoneNum = (value) => {
    dispatch(
      changeField({
        form: 'register',
        key: 'phone_number',
        value,
      }),
    );
  };
  const handleChangeResidence = (value) => {
    dispatch(
      changeField({
        form: 'register',
        key: 'residence',
        value,
      }),
    );
  };
  // 폼 등록 이벤트 핸들러
  const onSubmit = (e) => {
    e.preventDefault();
    const {
      id,
      password,
      passwordConfirm,
      name,
      registration_number,
      sex,
      phone_number,
      residence,
    } = form;

    // 하나라도 비어있다면
    if (
      [
        id,
        password,
        passwordConfirm,
        name,
        registration_number,
        sex,
        phone_number,
        residence,
      ].includes('')
    ) {
      setError('빈 칸을 모두 입력하세요.');
      return;
    }

    // 비밀번호가 일치하지 않는다면
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      changeField({ form: 'register', key: 'password', value: '' });
      changeField({ form: 'register', key: 'passwordConfirm', value: '' });
      return;
    }

    // 잘못된 주민번호
    if (registration_number.length !== 14) {
      setError('올바른 주민번호 형식이 아닙니다.');
      return;
    }

    // 잘못된 전화번호
    if (phone_number.length !== 13 && phone_number.length !== 12) {
      setError('올바른 전화번호 형식이 아닙니다.');
      return;
    }

    dispatch(register({ id, password }));
  };

  // 컴포넌트가 처음 렌더링 될 때 form 을 초기화함
  useEffect(() => {
    dispatch(initializeForm('register'));
  }, [dispatch]);

  // 회원가입 성공 / 실패 처리
  useEffect(() => {
    if (authError) {
      // 계정명이 이미 존재할 때
      if (authError.response.status === 409) {
        setError('이미 존재하는 계정명입니다.');
        return;
      }
      // 기타 이유
      setError('회원가입 실패');
      return;
    }

    if (auth) {
      console.log('회원가입 성공');
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  // user 값이 잘 설정되었는지 확인
  useEffect(() => {
    if (user) {
      history.push('/home'); // 홈 화면으로 이동
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    }
  }, [history, user]);

  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
      handleSex={handleSex}
      handleChangePhoneNum={handleChangePhoneNum}
      handleChangeRegNum={handleChangeRegNum}
      handleChangeResidence={handleChangeResidence}
    />
  );
};

export default withRouter(RegisterForm);
