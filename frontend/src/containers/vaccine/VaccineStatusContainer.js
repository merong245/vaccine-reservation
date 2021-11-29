import React from 'react';
import { ContentsBox, ContentsBlock } from '../../components/common/Contents';
import SideNavigator from '../../components/common/SideNavigator';
import HospitalList from '../../components/vaccine/HospitalList';

const VaccineStatusContainer = () => {
  return (
    <ContentsBox>
      <SideNavigator />
      <ContentsBlock>
        <HospitalList />
      </ContentsBlock>
    </ContentsBox>
  );
};

export default VaccineStatusContainer;
