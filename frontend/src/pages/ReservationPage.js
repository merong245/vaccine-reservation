import React from 'react';
import Header from '../components/common/Header';
import ReservationContainer from '../containers/vaccin/ReservationContainer';

const ReservationPage = () => {
  return (
    <>
      <Header title="n차 백신 예약" />
      <ReservationContainer />
    </>
  );
};

export default ReservationPage;
