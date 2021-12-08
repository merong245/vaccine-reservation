import client from './client';

// 로그인
export const login = ({ id, password }) =>
  client.post('/auth/login', { id, password });

// 회원가입
export const register = ({
  id,
  password,
  name,
  registration_number,
  sex,
  phone_number,
  residence,
}) =>
  client.post('/auth/register', {
    id,
    password,
    name,
    registration_number,
    sex,
    phone_number,
    residence,
  });

// 로그인 상태 확인
export const check = () => client.get('/auth/check');

// 로그아웃
export const logout = () => client.post('/auth/logout');
