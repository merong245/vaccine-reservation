import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
import ResultContainer from '../containers/vaccine/ResultContainer';
import { ContentsBox } from '../components/common/Contents';
import SideNavigator from '../components/common/SideNavigator';

const ResultPage = () => {
  return (
    <>
      <HeaderContainer title="접종결과" />
      <ContentsBox>
        <SideNavigator />
        <ResultContainer />
      </ContentsBox>
    </>
  );
};

export default ResultPage;
