import client from './client';

// 로그인
export const login = ({ id, password }) =>
  client.post('/api/auth/login', { id, password });

// 회원가입
export const register = ({
  id,
  password,
  name,
  registration_number,
  age,
  sex,
  phone_number,
}) =>
  client.post('/api/auth/register', {
    id,
    password,
    name,
    registration_number,
    age,
    sex,
    phone_number,
  });

// 로그인 상태 확인
export const check = () => client.get('/api/auth/check');

// 로그아웃
export const logout = () => client.post('/api/auth/logout');
