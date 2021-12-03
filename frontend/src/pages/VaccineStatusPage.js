import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
import VaccineStatusContainer from '../containers/vaccine/VaccineStatusContainer';

const VaccineStatusPage = () => {
  return (
    <>
      <HeaderContainer title="잔여 백신 현황" />
      <VaccineStatusContainer />
    </>
  );
};

export default VaccineStatusPage;
