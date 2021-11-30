import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { ContentsBlock } from '../common/Contents';
import HospitalList from './HospitalList';
import { InputBlock, StyledInput } from '../common/Input';
import DaumPostcode from '../../../node_modules/react-daum-postcode/lib/DaumPostcode';
import { StyledBox, StyledClickBox } from '../common/Contents';
import Select from 'react-select';
import Button from '../common/Button';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
registerLocale('ko', ko);

const SelectBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const DateWrapper = styled.div`
  width: 33%;
  margin-right: 1rem;
  margin-left: 1rem;
`;

const StyledSelect = styled(Select)`
  width: 34%;
`;

const ReservationForm = (onSubmit) => {
  const today = new Date();
  const [viewAddress, setViewAddress] = useState(true);
  const [address, setAddress] = useState('');
  const [reserveDate, setReserveDate] = useState(
    new Date(today.setDate(today.getDate() + 1)),
  );
  const [viewList, setViewList] = useState(false);

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

  // const getFormattedDate = (date) => {
  //   const month = date.toLocaleDateString('ko-KR', {
  //     month: 'long',
  //   });

  //   const day = date.toLocaleDateString('ko-KR', {
  //     day: 'numeric',
  //   });

  //   return `${month.substr(0, month.length - 1)}/${day.substr(
  //     0,
  //     day.length - 1,
  //   )}`;
  // };

  return (
    <ContentsBlock>
      <form>
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
        <SelectBlock>
          <StyledSelect
            options={vaccines}
            placeholder="백신 선택"
            isClearable
          />
          <DateWrapper>
            {/* Thu Dec 16 2021 00:11:38 GMT+0900 (대한민국 표준시) */}
            <DatePicker
              style={{ width: '30%' }}
              locale="ko"
              selected={reserveDate}
              onChange={(date) => {
                setReserveDate(date);
              }}
              minDate={new Date(today.setDate(today.getDate() + 1))} // 과거 날짜 disable
            />
          </DateWrapper>
          <StyledSelect options={hours} placeholder="시간 선택" isClearable />
        </SelectBlock>
        {!viewList && (
          <Button onClick={() => setViewList(true)} fullwidth="true">
            예약가능 병원 보기
          </Button>
        )}
        {viewList && (
          <>
            <InputBlock style={{ marginTop: '1rem' }}>
              <StyledInput
                placeholder="병원명으로 검색"
                style={{ width: '100%' }}
              />
            </InputBlock>
            <HospitalList type="reservation" />
          </>
        )}
      </form>
    </ContentsBlock>
  );
};

export default ReservationForm;
