import React, { useEffect } from 'react';
import Visualization from '../../components/vaccine/Visualization';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, getResult } from '../../modules/result';

const ResultContainer = () => {
  const dispatch = useDispatch();
  const { options, result, error, loading } = useSelector(
    ({ result, loading }) => ({
      options: result.options,
      result: result.result,
      error: result.error,
      loading: loading['result/GET_RESULT'],
    }),
  );

  useEffect(() => {
    console.log(options);
    if (
      options.option0 &&
      options.option2 &&
      (options.option0 === 'Pie' || options.option1)
    )
      dispatch(getResult(options));
  }, [
    dispatch,
    options,
    options.option0,
    options.option1,
    options.option2,
    options.option3,
  ]);

  useEffect(() => {
    console.log(result);
  }, [result]);

  // 그래프 선택
  const graphChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    dispatch(
      changeField({
        options: 'options',
        key: 'option0',
        value: value,
      }),
    );
  };

  // 표시 선택
  const criteriaChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    dispatch(
      changeField({
        options: 'options',
        key: 'option1',
        value: value,
      }),
    );
  };

  // 정보 선택
  const infoChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    dispatch(
      changeField({
        options: 'options',
        key: 'option2',
        value: value,
      }),
    );
  };

  // 누적 선택
  const accumulateChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : false;
    dispatch(
      changeField({
        options: 'options',
        key: 'option3',
        value: value,
      }),
    );
  };

  return (
    <Visualization
      options={options}
      result={result}
      error={error}
      loading={loading}
      graphChange={graphChange}
      criteriaChange={criteriaChange}
      infoChange={infoChange}
      accumulateChange={accumulateChange}
    />
  );
};

export default ResultContainer;
