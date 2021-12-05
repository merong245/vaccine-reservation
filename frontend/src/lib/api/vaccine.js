import client from './client';
import qs from 'qs';

export const getUserInfo = () => client.get(`/info`);

export const completeReservation = ({ vaccination_number }) =>
  client.post(`/done_vaccine`, { vaccination_number });

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

  return client.get(`/remaining_vaccine?${queryString}`);
};

export const getResult = ({ option0, option1, option2, option3 }) => {
  const queryString = qs.stringify({ option0, option1, option2, option3 });

  return client.get(`/vaccine_result?${queryString}`);
};

export const reservation = ({
  residence,
  vaccine_type,
  date,
  time,
  hospital_name,
}) =>
  client.post(`/reservation`, {
    residence,
    vaccine_type,
    date,
    time,
    hospital_name,
  });
