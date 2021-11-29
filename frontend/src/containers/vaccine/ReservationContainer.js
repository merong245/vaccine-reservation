import React from 'react';
import { ContentsBox } from '../../components/common/Contents';
import SideNavigator from '../../components/common/SideNavigator';
import ReservationForm from '../../components/vaccine/ReservationForm';

const ReservationContainer = () => {
  return (
    <ContentsBox>
      <SideNavigator />
      <ReservationForm />
    </ContentsBox>
  );
};

export default ReservationContainer;
