import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
import ReservationContainer from '../containers/vaccine/ReservationContainer';
import { ContentsBox } from '../components/common/Contents';
import SideNavigator from '../components/common/SideNavigator';

const ReservationPage = () => {
  return (
    <>
      <HeaderContainer title="백신 예약" />
      <ContentsBox>
        <SideNavigator />
        <ReservationContainer />
      </ContentsBox>
    </>
  );
};

export default ReservationPage;
