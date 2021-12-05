import React, { useEffect, useState } from 'react';
import ReservationForm from '../../components/vaccine/ReservationForm';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRemainingVaccine,
  changeField,
  reservation,
  initializeStatus,
} from '../../modules/vaccineStatus';
import { check } from '../../modules/user';
import { getUserInfo } from '../../modules/info';
import { withRouter } from 'react-router-dom';

const ReservationContainer = ({ history }) => {
  const [error, setError] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState('');
  const dispatch = useDispatch();
  const {
    options,
    vaccine_list,
    list_error,
    loading,
    user,
    reserv,
    reserv_error,
  } = useSelector(({ vaccine_list, loading, user }) => ({
    options: vaccine_list,
    vaccine_list: vaccine_list.vaccine_list,
    list_error: vaccine_list.error,
    reserv: vaccine_list.reservation,
    reserv_error: vaccine_list.reserv_error,
    loading: loading['vaccine/GET_REMAINING_VACCINE'],
    user: user.user,
  }));

  const { info } = useSelector(({ info }) => ({
    info: info.info,
  }));

  useEffect(() => {
    if (user !== null) dispatch(getUserInfo());
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(check());
    dispatch(initializeStatus());
  }, [dispatch]);

  // 예약 가능 병원 리스트 보기
  const handleList = (e) => {
    dispatch(getRemainingVaccine(options));
  };

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

  // 시간 선택 이벤트 핸들러
  const handleTime = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    dispatch(
      changeField({
        key: 'time',
        value: value,
      }),
    );
  };

  // 주소정보 검색 완료 이벤트 헨들러
  const handleComplete = (data) => {
    dispatch(
      changeField({
        key: 'residence',
        value: data.sigunguCode,
      }),
    );
  };

  // 날짜 변경 이벤트 헨들러
  const handleDate = (date) => {
    dispatch(
      changeField({
        key: 'date',
        value: date,
      }),
    );
  };

  // 병원명 변경 이벤트 헨들러
  const handleHopsital = (data) => {
    dispatch(
      changeField({
        key: 'hospital_name',
        value: data,
      }),
    );
  };

  // 예약 이벤트 핸들러
  const onSubmit = (e) => {
    e.preventDefault();
    const { residence, vaccine_type, date, time } = options;
    const hospital_name = selectedHospital;

    // 하나라도 비어있다면
    if ([residence, vaccine_type, date, time, hospital_name].includes('')) {
      setError('예약 정보가 부족합니다.');
      return;
    }

    console.log('예약병원', hospital_name);

    dispatch(
      reservation({
        residence,
        vaccine_type,
        date,
        time,
        hospital_name,
      }),
    );
  };

  // 회원가입 성공 / 실패 처리
  useEffect(() => {
    if (reserv_error) {
      // 기타 이유
      setError('예약 실패');
      return;
    }

    if (reserv) {
      console.log('예약 성공');
      history.push('/home'); // 홈 화면으로 이동
    }
  }, [reserv_error, reserv, history]);

  return (
    <ReservationForm
      info={info}
      options={options}
      list={vaccine_list}
      error={error}
      list_error={list_error}
      loading={loading}
      user={user}
      handleType={handleType}
      handleTime={handleTime}
      handleDate={handleDate}
      handleComplete={handleComplete}
      handleHopsital={handleHopsital}
      handleList={handleList}
      setSelectedHospital={setSelectedHospital}
      onSubmit={onSubmit}
    />
  );
};

export default withRouter(ReservationContainer);
