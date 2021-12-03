import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
import HomeContainer from '../containers/vaccine/HomeContainer';
import { ContentsBox } from '../components/common/Contents';
import SideNavigator from '../components/common/SideNavigator';

const HomePage = () => {
  return (
    <>
      <HeaderContainer title="나의 접종현황" />
      <ContentsBox>
        <SideNavigator />
        <HomeContainer />
      </ContentsBox>
    </>
  );
};

export default HomePage;
