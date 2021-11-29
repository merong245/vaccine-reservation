import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { ContentsBlock } from '../common/Contents';
import HospitalList from './HospitalList';
import { InputBlock, StyledInput } from '../common/Input';
import DaumPostcode from '../../../node_modules/react-daum-postcode/lib/DaumPostcode';
import { StyledBox, StyledClickBox } from '../common/Contents';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StyledSelect = styled(Select)`
  font-size: 1rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  display: flex;

  .react-select-container {
    flex-direction: column;
    display: flex;
    width: 100%;
  }
  .css-319lph-ValueContainer {
    width: 80%;
    display: flex;
  }
`;

const ReservationForm = (onSubmit) => {
  const [viewAddress, setViewAddress] = useState(true);
  const [address, setAddress] = useState('');

  // 주소정보 검색 완료 이벤트 헨들러
  const handleComplete = (data) => {
    setAddress(data.sido + ' ' + data.sigungu);
    setViewAddress(true);
  };

  // 백신 옵션
  const vaccines = useMemo(
    () => [
      { value: '화이자', label: '화이자' },
      { value: '모더나', label: '모더나' },
      { value: '아스트라제네카', label: '아스트라제네카' },
    ],
    [],
  );

  // 시간 옵션
  const hours = useMemo(
    () => [
      { value: '09:00', label: '9:00' },
      { value: '10:00', label: '10:00' },
      { value: '11:00', label: '11:00' },
      { value: '12:00', label: '12:00' },
      { value: '13:00', label: '13:00' },
      { value: '14:00', label: '14:00' },
      { value: '15:00', label: '15:00' },
      { value: '16:00', label: '16:00' },
      { value: '17:00', label: '17:00' },
    ],
    [],
  );

  return (
    <ContentsBlock>
      <InputBlock>
        {viewAddress ? (
          <StyledBox
            name="residence"
            style={{ height: '3rem', overflow: 'hidden' }}
          >
            {address === '' ? (
              <div className="initial">지역 선택</div>
            ) : (
              address
            )}
            <StyledClickBox
              onClick={() => {
                setAddress('');
                setViewAddress(!viewAddress);
              }}
            >
              {address === '' ? '입력' : '수정'}
            </StyledClickBox>
          </StyledBox>
        ) : (
          <DaumPostcode
            onComplete={handleComplete}
            autoClose={false}
            style={{ height: 100 }}
          />
        )}
      </InputBlock>
      <InputBlock>
        <StyledSelect options={vaccines} placeholder="백신 선택" isClearable />
      </InputBlock>
      <InputBlock>
        <DatePicker />
      </InputBlock>
      <InputBlock>
        <StyledSelect options={hours} placeholder="시간 선택" isClearable />
      </InputBlock>
      <InputBlock>
        <StyledInput placeholder="병원명으로 검색" style={{ width: '100%' }} />
      </InputBlock>
      <form style={{ marginTop: '1rem' }}>
        <HospitalList />
      </form>
    </ContentsBlock>
  );
};

export default ReservationForm;
