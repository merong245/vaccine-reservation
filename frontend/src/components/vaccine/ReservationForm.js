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
import palette from '../../lib/styles/palette';
import { InfoBlock, InfoText } from '../common/Info';
registerLocale('ko', ko);

const SearchButton = styled(StyledBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
  height: 3rem;
  border: none;
  background-color: ${palette.gray[7]};
  color: #ffffff;
  font-weight: bold;
  &:hover {
    background-color: ${palette.gray[6]};
  }
`;

const SelectBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const StyledDatePicker = styled(DatePicker)`
  margin-right: 1rem;
  margin-left: 1rem;
  height: 38px;
  width: auto;
  border-radius: 4px;
  border: 1px solid ${palette.gray[4]};
`;

const StyledSelect = styled(Select)`
  width: 33%;
`;

const ReservationForm = ({
  info,
  options,
  list,
  error,
  list_error,
  loading,
  user,
  handleType,
  handleTime,
  handleDate,
  handleComplete,
  handleHopsital,
  handleList,
  setSelectedHospital,
  onSubmit,
}) => {
  const today = new Date();
  const [viewAddress, setViewAddress] = useState(true);
  const [address, setAddress] = useState('');
  const [viewList, setViewList] = useState(false);
  const [disable, setDisable] = useState(false);

  // 주소정보 검색 완료 이벤트 헨들러
  const handleCompleteWrapper = (data) => {
    setAddress(data.sido + ' ' + data.sigungu);
    setViewAddress(true);
    handleComplete(data);
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

  return user ? (
    (info && info.vaccination_number !== 2) || info === undefined ? (
      <ContentsBlock style={{ width: '700px' }}>
        <form onSubmit={onSubmit}>
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
                {!disable && (
                  <StyledClickBox
                    onClick={() => {
                      setAddress('');
                      setViewAddress(!viewAddress);
                    }}
                  >
                    {address === '' ? '입력' : '수정'}
                  </StyledClickBox>
                )}
              </StyledBox>
            ) : (
              <DaumPostcode
                onComplete={handleCompleteWrapper}
                autoClose={false}
                style={{ height: 100 }}
              />
            )}
          </InputBlock>
          <SelectBlock>
            <StyledSelect
              onChange={handleType}
              options={vaccines}
              placeholder="백신 선택"
              isClearable
              isDisabled={disable}
            />
            <div>
              {/* Thu Dec 16 2021 00:11:38 GMT+0900 (대한민국 표준시) */}
              <StyledDatePicker
                dateFormat="yyyy/MM/dd"
                disabled={disable}
                locale="ko"
                selected={options.date} //new Date(today.setDate(today.getDate() + 1))
                onChange={handleDate}
                minDate={new Date(today.setDate(today.getDate() + 1))} // 과거 날짜 disable
                placeholderText=" 날짜 선택"
                fixedHeight
                withPortal
              />
            </div>
            <StyledSelect
              onChange={handleTime}
              options={hours}
              placeholder="시간 선택"
              isClearable
              isDisabled={disable}
            />
          </SelectBlock>
          {!viewList && (
            <Button
              onClick={(e) => {
                setViewList(true);
                setDisable(true);
                handleList(e);
              }}
              fullwidth="true"
              disabled={
                !options.residence ||
                !options.time ||
                !options.date ||
                !options.vaccine_type
              }
            >
              예약가능 병원 보기
            </Button>
          )}
          {viewList && (
            <>
              <InputBlock style={{ marginTop: '1rem', marginBottom: '0.2rem' }}>
                <StyledInput
                  placeholder="병원명 검색"
                  style={{ width: '85%' }}
                  value={options.hospital_name}
                  onChange={(e) => {
                    handleHopsital(e.target.value);
                  }}
                />
                <SearchButton
                  onClick={(e) => {
                    handleList(e);
                  }}
                >
                  검색
                </SearchButton>
              </InputBlock>
              <HospitalList
                info={info}
                type="reservation"
                list={list}
                hospitalName={options.hospital_name}
                setSelectedHospital={setSelectedHospital}
              />
            </>
          )}
        </form>
      </ContentsBlock>
    ) : (
      <ContentsBlock>
        <InfoBlock>
          <InfoText>2차 접종을 완료하여 예약할 수 없습니다.</InfoText>
        </InfoBlock>
      </ContentsBlock>
    )
  ) : (
    <ContentsBlock>
      <InfoBlock>
        <InfoText>로그인이 필요한 서비스입니다.</InfoText>
      </InfoBlock>
    </ContentsBlock>
  );
};

export default ReservationForm;
