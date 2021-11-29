import React from 'react';
import { ContentsBox } from '../../components/common/Contents';
import SideNavigator from '../../components/common/SideNavigator';
import VaccineInfo from '../../components/vaccine/VaccineInfo';

const HomeContainer = () => {
  return (
    <ContentsBox>
      <SideNavigator />
      <VaccineInfo />
    </ContentsBox>
  );
};

export default HomeContainer;
