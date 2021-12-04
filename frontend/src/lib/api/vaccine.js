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

export const getResult = ({ option0, option1, option2, option3 }) => {
  const queryString = qs.stringify({ option0, option1, option2, option3 });
  console.log(queryString);
  client.get(`/vaccine_result?${queryString}`);
};
