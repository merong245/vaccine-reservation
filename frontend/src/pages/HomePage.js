import React from 'react';
import Header from '../components/common/Header';
import HomeContainer from '../containers/vaccine/HomeContainer';

const HomePage = () => {
  return (
    <>
      <Header title="나의 접종현황" />
      <HomeContainer />
    </>
  );
};

export default HomePage;
