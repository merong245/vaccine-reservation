import client from './client';

export const getUserInfo = () => client.get(`/info`);
