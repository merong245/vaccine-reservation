import React, { useState, useMemo } from 'react';
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

const barData = [
  {
    country: 'AD',
    'hot dog': 2,
    'hot dogColor': 'hsl(288, 70%, 50%)',
    burger: 35,
    burgerColor: 'hsl(178, 70%, 50%)',
    sandwich: 109,
    sandwichColor: 'hsl(207, 70%, 50%)',
    kebab: 58,
    kebabColor: 'hsl(170, 70%, 50%)',
    fries: 76,
    friesColor: 'hsl(185, 70%, 50%)',
    donut: 20,
    donutColor: 'hsl(179, 70%, 50%)',
  },
  {
    country: 'AE',
    'hot dog': 172,
    'hot dogColor': 'hsl(253, 70%, 50%)',
    burger: 144,
    burgerColor: 'hsl(159, 70%, 50%)',
    sandwich: 84,
    sandwichColor: 'hsl(75, 70%, 50%)',
    kebab: 116,
    kebabColor: 'hsl(271, 70%, 50%)',
    fries: 176,
    friesColor: 'hsl(270, 70%, 50%)',
    donut: 157,
    donutColor: 'hsl(304, 70%, 50%)',
  },
  {
    country: 'AF',
    'hot dog': 104,
    'hot dogColor': 'hsl(146, 70%, 50%)',
    burger: 168,
    burgerColor: 'hsl(284, 70%, 50%)',
    sandwich: 46,
    sandwichColor: 'hsl(266, 70%, 50%)',
    kebab: 112,
    kebabColor: 'hsl(200, 70%, 50%)',
    fries: 154,
    friesColor: 'hsl(19, 70%, 50%)',
    donut: 147,
    donutColor: 'hsl(214, 70%, 50%)',
  },
  {
    country: 'AG',
    'hot dog': 97,
    'hot dogColor': 'hsl(210, 70%, 50%)',
    burger: 198,
    burgerColor: 'hsl(217, 70%, 50%)',
    sandwich: 116,
    sandwichColor: 'hsl(184, 70%, 50%)',
    kebab: 4,
    kebabColor: 'hsl(13, 70%, 50%)',
    fries: 38,
    friesColor: 'hsl(63, 70%, 50%)',
    donut: 107,
    donutColor: 'hsl(172, 70%, 50%)',
  },
  {
    country: 'AI',
    'hot dog': 73,
    'hot dogColor': 'hsl(76, 70%, 50%)',
    burger: 33,
    burgerColor: 'hsl(184, 70%, 50%)',
    sandwich: 158,
    sandwichColor: 'hsl(283, 70%, 50%)',
    kebab: 55,
    kebabColor: 'hsl(122, 70%, 50%)',
    fries: 18,
    friesColor: 'hsl(118, 70%, 50%)',
    donut: 162,
    donutColor: 'hsl(231, 70%, 50%)',
  },
  {
    country: 'AL',
    'hot dog': 150,
    'hot dogColor': 'hsl(193, 70%, 50%)',
    burger: 63,
    burgerColor: 'hsl(13, 70%, 50%)',
    sandwich: 109,
    sandwichColor: 'hsl(49, 70%, 50%)',
    kebab: 14,
    kebabColor: 'hsl(323, 70%, 50%)',
    fries: 106,
    friesColor: 'hsl(32, 70%, 50%)',
    donut: 180,
    donutColor: 'hsl(4, 70%, 50%)',
  },
  {
    country: 'AM',
    'hot dog': 160,
    'hot dogColor': 'hsl(126, 70%, 50%)',
    burger: 148,
    burgerColor: 'hsl(320, 70%, 50%)',
    sandwich: 122,
    sandwichColor: 'hsl(122, 70%, 50%)',
    kebab: 152,
    kebabColor: 'hsl(187, 70%, 50%)',
    fries: 103,
    friesColor: 'hsl(208, 70%, 50%)',
    donut: 92,
    donutColor: 'hsl(113, 70%, 50%)',
  },
];
const lineData = [
  {
    id: 'japan',
    color: 'hsl(160, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 105,
      },
      {
        x: 'helicopter',
        y: 211,
      },
      {
        x: 'boat',
        y: 146,
      },
      {
        x: 'train',
        y: 294,
      },
      {
        x: 'subway',
        y: 95,
      },
      {
        x: 'bus',
        y: 50,
      },
      {
        x: 'car',
        y: 9,
      },
      {
        x: 'moto',
        y: 120,
      },
      {
        x: 'bicycle',
        y: 134,
      },
      {
        x: 'horse',
        y: 28,
      },
      {
        x: 'skateboard',
        y: 269,
      },
      {
        x: 'others',
        y: 231,
      },
    ],
  },
  {
    id: 'france',
    color: 'hsl(33, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 291,
      },
      {
        x: 'helicopter',
        y: 187,
      },
      {
        x: 'boat',
        y: 43,
      },
      {
        x: 'train',
        y: 155,
      },
      {
        x: 'subway',
        y: 132,
      },
      {
        x: 'bus',
        y: 252,
      },
      {
        x: 'car',
        y: 252,
      },
      {
        x: 'moto',
        y: 237,
      },
      {
        x: 'bicycle',
        y: 69,
      },
      {
        x: 'horse',
        y: 229,
      },
      {
        x: 'skateboard',
        y: 283,
      },
      {
        x: 'others',
        y: 127,
      },
    ],
  },
  {
    id: 'us',
    color: 'hsl(103, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 34,
      },
      {
        x: 'helicopter',
        y: 296,
      },
      {
        x: 'boat',
        y: 255,
      },
      {
        x: 'train',
        y: 35,
      },
      {
        x: 'subway',
        y: 147,
      },
      {
        x: 'bus',
        y: 192,
      },
      {
        x: 'car',
        y: 236,
      },
      {
        x: 'moto',
        y: 243,
      },
      {
        x: 'bicycle',
        y: 5,
      },
      {
        x: 'horse',
        y: 297,
      },
      {
        x: 'skateboard',
        y: 9,
      },
      {
        x: 'others',
        y: 14,
      },
    ],
  },
  {
    id: 'germany',
    color: 'hsl(305, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 117,
      },
      {
        x: 'helicopter',
        y: 23,
      },
      {
        x: 'boat',
        y: 67,
      },
      {
        x: 'train',
        y: 177,
      },
      {
        x: 'subway',
        y: 163,
      },
      {
        x: 'bus',
        y: 155,
      },
      {
        x: 'car',
        y: 55,
      },
      {
        x: 'moto',
        y: 143,
      },
      {
        x: 'bicycle',
        y: 294,
      },
      {
        x: 'horse',
        y: 210,
      },
      {
        x: 'skateboard',
        y: 231,
      },
      {
        x: 'others',
        y: 56,
      },
    ],
  },
  {
    id: 'norway',
    color: 'hsl(14, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 43,
      },
      {
        x: 'helicopter',
        y: 59,
      },
      {
        x: 'boat',
        y: 264,
      },
      {
        x: 'train',
        y: 112,
      },
      {
        x: 'subway',
        y: 198,
      },
      {
        x: 'bus',
        y: 84,
      },
      {
        x: 'car',
        y: 291,
      },
      {
        x: 'moto',
        y: 34,
      },
      {
        x: 'bicycle',
        y: 279,
      },
      {
        x: 'horse',
        y: 289,
      },
      {
        x: 'skateboard',
        y: 277,
      },
      {
        x: 'others',
        y: 260,
      },
    ],
  },
];
const pieData = [
  {
    id: 'lisp',
    label: 'lisp',
    value: 102,
    color: 'hsl(320, 70%, 50%)',
  },
  {
    id: 'rust',
    label: 'rust',
    value: 94,
    color: 'hsl(240, 70%, 50%)',
  },
  {
    id: 'hack',
    label: 'hack',
    value: 438,
    color: 'hsl(300, 70%, 50%)',
  },
  {
    id: 'go',
    label: 'go',
    value: 234,
    color: 'hsl(120, 70%, 50%)',
  },
  {
    id: 'scala',
    label: 'scala',
    value: 285,
    color: 'hsl(312, 70%, 50%)',
  },
];

const Visualization = ({
  options,
  result,
  error,
  loading,
  graphChange,
  criteriaChange,
  infoChange,
  accumulateChange,
}) => {
  const [graph, setGraph] = useState('Bar');
  const [keys, setKeys] = useState([]);

  // 그래프 선택
  const graphOptions = useMemo(
    () => [
      { value: 'Bar', label: '막대형' },
      { value: 'Line', label: '선형' },
      { value: 'Pie', label: '원형' },
    ],
    [],
  );

  // 표시 옵션
  const criteriaOptions = useMemo(
    () => [
      { value: 'time', label: '시간별' },
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

  // 누적 옵션
  const accumulateOptions = useMemo(
    () => [
      { value: false, label: '기본' },
      { value: true, label: '누적' },
    ],
    [],
  );

  const keysList = useMemo(
    () => [
      {
        number: ['1차 접종', '2차 접종'],
        type: ['화이자', '모더나', '아스트라제네카'],
        gender: ['남자', '여자'],
        age: [
          '10대',
          '20대',
          '30대',
          '40대',
          '50대',
          '60대',
          '70대',
          '80대 이상',
        ],
      },
    ],
    [],
  );

  // useEffect(() => {
  //   setKeys(
  //     options.option2 === 'number'
  //       ? keysList[0].number
  //       : options.option2 === 'type'
  //       ? keysList[0].type
  //       : options.option2 === 'gender'
  //       ? keysList[0].gender
  //       : options.option2 === 'age'
  //       ? keysList[0].age
  //       : [],
  //   );
  // }, [keysList, options.option2]);

  return (
    <ContentsBlock style={{ marginTop: '6rem' }}>
      <SelectBox>
        <StyledSelect
          onChange={(selectedOption) => {
            setGraph(selectedOption.value);
            graphChange(selectedOption);
          }}
          selected={graphOptions[0]}
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
          options={infoOptions}
          placeholder="표시 정보"
        />
        <StyledSelect
          onChange={accumulateChange}
          options={accumulateOptions}
          placeholder="누적 표시"
          isDisabled={graph === 'Pie'}
        />
      </SelectBox>
      {error || loading || !result ? ( // 에러, 로딩, 응답없음
        <></>
      ) : graph === 'Bar' ? (
        <BarGraph data={barData} options={options} />
      ) : graph === 'Line' ? (
        <LineGraph data={lineData} options={options} />
      ) : graph === 'Pie' && result ? (
        <PieGraph data={result} options={options} />
      ) : (
        <></>
      )}
    </ContentsBlock>
  );
};

export default Visualization;
