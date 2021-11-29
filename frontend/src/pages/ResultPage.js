import React from 'react';
import Header from '../components/common/Header';
import ResultContainer from '../containers/vaccine/ResultContainer';

const ResultPage = () => {
  return (
    <>
      <Header title="접종결과" />
      <ResultContainer />
    </>
  );
};

export default ResultPage;
