import React, { useState, useEffect, useMemo } from 'react';
import { StyledBox, StyledClickBox } from '../../components/common/Contents';
import HospitalList from '../../components/vaccine/HospitalList';
import { useDispatch, useSelector } from 'react-redux';
import { getRemainingVaccine, changeField } from '../../modules/vaccineStatus';
import Select from 'react-select';
import { InputBlock } from '../../components/common/Input';
import DaumPostcode from '../../../node_modules/react-daum-postcode/lib/DaumPostcode';

const VaccineStatusContainer = () => {
  const dispatch = useDispatch();
  const { vaccine_type, residence, vaccine_list, error, loading, user } =
    useSelector(({ vaccine_list, loading, user }) => ({
      vaccine_type: vaccine_list.vaccine_type,
      residence: vaccine_list.residence,
      vaccine_list: vaccine_list.vaccine_list,
      error: vaccine_list.error,
      loading: loading['vaccine/GET_REMAINING_VACCINE'],
      user: user.user,
    }));

  const [viewAddress, setViewAddress] = useState(true);
  const [province, setProvince] = useState('');

  useEffect(() => {
    dispatch(getRemainingVaccine({ vaccine_type, residence }));
  }, [vaccine_type, residence, dispatch]);

  // 백신 타입 선택 이벤트 핸들러
  const handleType = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    dispatch(
      changeField({
        key: 'vaccine_type',
        value: value,
      }),
    );
  };

  // 주소정보 검색 완료 이벤트 헨들러
  const handleComplete = (data) => {
    setProvince(data.sido + ' ' + data.sigungu);
    setViewAddress(true);
    dispatch(
      changeField({
        key: 'residence',
        value: data.sigunguCode,
      }),
    );
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

  return (
    <>
      <InputBlock style={{ marginBottom: '1rem' }}>
        {viewAddress ? (
          <StyledBox
            name="residence"
            style={{ height: '3rem', overflow: 'hidden' }}
          >
            {province === '' ? (
              <div className="initial">지역 선택</div>
            ) : (
              province
            )}
            <StyledClickBox
              onClick={() => {
                setProvince('');
                setViewAddress(!viewAddress);
              }}
            >
              {province === '' ? '입력' : '수정'}
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
      <Select
        onChange={handleType}
        options={vaccines}
        placeholder="백신 선택"
        isClearable
      />
      <HospitalList
        list={vaccine_list}
        error={error}
        loading={loading}
        user={user}
      />
    </>
  );
};

export default VaccineStatusContainer;
