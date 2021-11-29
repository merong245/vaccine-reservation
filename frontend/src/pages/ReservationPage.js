import React from 'react';
import Header from '../components/common/Header';
import ReservationContainer from '../containers/vaccine/ReservationContainer';

const ReservationPage = () => {
  return (
    <>
      <Header title="백신 예약" />
      <ReservationContainer />
    </>
  );
};

export default ReservationPage;
