import client from './client';

// 로그인
export const login = ({ id, password }) =>
  client.post('/login', { id, password });

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
  client.post('/register', {
    id,
    password,
    name,
    registration_number,
    sex,
    phone_number,
    residence,
  });

// 로그인 상태 확인
export const check = () => client.get('/check');

// 로그아웃
export const logout = () => client.post('/logout');
