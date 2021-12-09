import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import BarGraph from '../graph/BarGraph';
import LineGraph from '../graph/LineGraph';
import PieGraph from '../graph/PieGraph';
import { ContentsBlock } from '../common/Contents';
import Select from 'react-select';

const SelectBox = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSelect = styled(Select)`
  width: 25%;
  & + & {
    margin-left: 1rem;
  }
`;

const Visualization = ({
  options,
  result,
  error,
  loading,
  graphChange,
  criteriaChange,
  infoChange,
}) => {
  const [graph, setGraph] = useState('Pie');
  const [lineDataSet, setLineDataSet] = useState({});

  // 그래프 선택
  const graphOptions = useMemo(
    () => [
      { value: 'Pie', label: '원형' },
      { value: 'Bar', label: '막대형' },
      { value: 'Line', label: '선형' },
    ],
    [],
  );

  // 표시 옵션
  const criteriaOptions = useMemo(
    () => [
      { value: 'time', label: '일자별' },
      { value: 'residence', label: '지역별' },
    ],
    [],
  );

  // 데이터 옵션
  const infoOptions = useMemo(
    () => [
      { value: 'number', label: '접종 차수' },
      { value: 'type', label: '백신 종류' },
      { value: 'age', label: '연령' },
      { value: 'gender', label: '성별' },
    ],
    [],
  );

  useEffect(() => {
    const dataSet = [
      {
        id: '접종완료',
        data: result,
      },
    ];
    setLineDataSet(dataSet);
  }, [options.option1, result]);

  return (
    <ContentsBlock style={{ marginTop: '6rem', height: '80%' }}>
      <SelectBox>
        <StyledSelect
          onChange={(selectedOption) => {
            setGraph(selectedOption.value);
            graphChange(selectedOption);
          }}
          defaultValue={graphOptions[0]}
          options={graphOptions}
          placeholder="그래프"
        />
        <StyledSelect
          onChange={criteriaChange}
          options={criteriaOptions}
          placeholder="표시 기준"
          isDisabled={graph === 'Pie'}
        />
        <StyledSelect
          onChange={infoChange}
          defaultValue={infoOptions[0]}
          options={infoOptions}
          placeholder="표시 정보"
          isDisabled={graph !== 'Pie'}
        />
      </SelectBox>
      {error || loading || !result ? ( // 에러, 로딩, 결과없음
        <></>
      ) : graph === 'Bar' ? (
        <BarGraph data={result} options={options} />
      ) : graph === 'Line' ? (
        <LineGraph data={lineDataSet} options={options} />
      ) : graph === 'Pie' ? (
        <PieGraph data={result} options={options} />
      ) : (
        <></>
      )}
    </ContentsBlock>
  );
};

export default Visualization;
