import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
import HomeContainer from '../containers/vaccine/HomeContainer';

const HomePage = () => {
  return (
    <>
      <HeaderContainer title="나의 접종현황" />
      <HomeContainer />
    </>
  );
};

export default HomePage;
