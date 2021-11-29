import React from 'react';
import Header from '../components/common/Header';
import VaccinStatusContainer from '../containers/vaccin/VaccinStatusContainer';

const VaccinStatusPage = () => {
  return (
    <>
      <Header title="잔여 백신 현황" />
      <VaccinStatusContainer />
    </>
  );
};

export default VaccinStatusPage;
