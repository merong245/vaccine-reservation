import React from 'react';
import { ContentsBox, ContentsBlock } from '../../components/common/Contents';
import SideNavigator from '../../components/common/SideNavigator';
import HospitalList from '../../components/vaccin/HospitalList';

const VaccinStatusContainer = () => {
  return (
    <ContentsBox>
      <SideNavigator />
      <ContentsBlock>
        <HospitalList />
      </ContentsBlock>
    </ContentsBox>
  );
};

export default VaccinStatusContainer;
