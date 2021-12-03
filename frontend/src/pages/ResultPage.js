import React from 'react';
import HeaderContainer from '../containers/common/HeaderContainer';
import ResultContainer from '../containers/vaccine/ResultContainer';

const ResultPage = () => {
  return (
    <>
      <HeaderContainer title="접종결과" />
      <ResultContainer />
    </>
  );
};

export default ResultPage;
