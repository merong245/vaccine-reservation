import React from 'react';
import { ContentsBox } from '../../components/common/Contents';
import SideNavigator from '../../components/common/SideNavigator';
import VaccinInfo from '../../components/vaccin/VaccinInfo';

const HomeContainer = () => {
  return (
    <ContentsBox>
      <SideNavigator />
      <VaccinInfo />
    </ContentsBox>
  );
};

export default HomeContainer;
