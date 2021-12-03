import React, { useEffect } from 'react';
import VaccineInfo from '../../components/vaccine/VaccineInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../modules/info';
import { withRouter } from 'react-router-dom';

const HomeContainer = () => {
  const dispatch = useDispatch();
  const { info, error, loading, user } = useSelector(
    ({ info, loading, user }) => ({
      info: info.info,
      error: info.error,
      loading: loading['vaccine/GET_USER_INFO'],
      user: user.user,
    }),
  );

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  useEffect(() => {
    console.log('info', info);
    console.log('error', error);
    console.log('loading', loading);
    console.log('user', user);
  }, [info, error, loading, user]);

  return (
    <VaccineInfo info={info} loading={loading} error={error} user={user} />
  );
};

export default withRouter(HomeContainer);
