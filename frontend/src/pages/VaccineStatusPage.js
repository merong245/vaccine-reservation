import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
import VaccineStatusContainer from '../containers/vaccine/VaccineStatusContainer';
import { ContentsBox, ContentsBlock } from '../components/common/Contents';
import SideNavigator from '../components/common/SideNavigator';

const VaccineStatusPage = () => {
  return (
    <>
      <HeaderContainer title="잔여 백신 현황" />
      <ContentsBox>
        <SideNavigator />
        <ContentsBlock>
          <VaccineStatusContainer />
        </ContentsBlock>
      </ContentsBox>
    </>
  );
};

export default VaccineStatusPage;
