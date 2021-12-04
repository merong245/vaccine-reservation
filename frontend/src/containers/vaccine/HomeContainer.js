import React, { useEffect } from 'react';
import VaccineInfo from '../../components/vaccine/VaccineInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../modules/info';

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
    if (user !== null) dispatch(getUserInfo());
  }, [dispatch, user]);

  return (
    <VaccineInfo info={info} loading={loading} error={error} user={user} />
  );
};

export default HomeContainer;
