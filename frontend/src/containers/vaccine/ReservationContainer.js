import React, { useEffect, useState } from 'react';
import ReservationForm from '../../components/vaccine/ReservationForm';
import { useDispatch, useSelector } from 'react-redux';
import { getRemainingVaccine, changeField } from '../../modules/vaccineStatus';
import { check } from '../../modules/user';

const ReservationContainer = () => {
  const dispatch = useDispatch();
  const { options, vaccine_list, error, loading, user } = useSelector(
    ({ vaccine_list, loading, user }) => ({
      options: vaccine_list,
      vaccine_list: vaccine_list.vaccine_list,
      error: vaccine_list.error,
      loading: loading['vaccine/GET_REMAINING_VACCINE'],
      user: user.user,
    }),
  );

  useEffect(() => {
    dispatch(check());
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
    const residence = data.sido + ' ' + data.sigungu;
    dispatch(
      changeField({
        key: 'residence',
        value: residence,
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
  const onSubmit = (e) => {};

  return (
    <ReservationForm
      options={options}
      list={vaccine_list}
      error={error}
      loading={loading}
      user={user}
      handleType={handleType}
      handleTime={handleTime}
      handleDate={handleDate}
      handleComplete={handleComplete}
      handleHopsital={handleHopsital}
      handleList={handleList}
    />
  );
};

export default ReservationContainer;
