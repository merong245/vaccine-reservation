import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
import ReservationContainer from '../containers/vaccine/ReservationContainer';

const ReservationPage = () => {
  return (
    <>
      <HeaderContainer title="백신 예약" />
      <ReservationContainer />
    </>
  );
};

export default ReservationPage;
