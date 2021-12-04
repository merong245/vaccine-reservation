import client from './client';
import qs from 'qs';

export const getUserInfo = () => client.get(`/info`);

export const completeReservation = () => client.get(`/complete`);

export const getRemainingVaccine = ({
  vaccine_type,
  residence,
  date,
  time,
  hospital_name,
}) => {
  const queryString = qs.stringify({
    vaccine_type,
    residence,
    date,
    time,
    hospital_name,
  });
  console.log(queryString);
  return client.get(`/remaining_vaccine?${queryString}`);
};
