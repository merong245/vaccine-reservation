import React from 'react';
import { ContentsBox } from '../../components/common/Contents';
import SideNavigator from '../../components/common/SideNavigator';
import Visualization from '../../components/vaccine/Visualization';

const ResultContainer = () => {
  return (
    <ContentsBox>
      <SideNavigator />
      <Visualization />
    </ContentsBox>
  );
};

export default ResultContainer;
