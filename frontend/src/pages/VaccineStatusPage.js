import React from 'react';
import Header from '../components/common/Header';
import VaccineStatusContainer from '../containers/vaccine/VaccineStatusContainer';

const VaccineStatusPage = () => {
  return (
    <>
      <Header title="잔여 백신 현황" />
      <VaccineStatusContainer />
    </>
  );
};

export default VaccineStatusPage;
