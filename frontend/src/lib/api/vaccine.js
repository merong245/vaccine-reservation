import client from './client';
import qs from 'qs';

export const getUserInfo = () => client.get(`/info`);

export const completeReservation = () => client.get(`/complete`);

export const getRemainingVaccine = ({ vaccine_type, province }) => {
  const queryString = qs.stringify({
    vaccine_type,
    province,
  });
  console.log({ vaccine_type, province }, queryString);
  return client.get(`/remaining_vaccine?${queryString}`);
};
