import React from 'react';
import Header from '../components/common/Header';
import VaccinInfo from '../components/vaccin/VaccinInfo';

const HomePage = () => {
  return (
    <>
      <Header title="나의 접종현황" />
      <VaccinInfo />
    </>
  );
};

export default HomePage;
