import React, { useEffect } from 'react';
import { ContentsBox } from '../../components/common/Contents';
import SideNavigator from '../../components/common/SideNavigator';
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

  return (
    <ContentsBox>
      <SideNavigator />
      <VaccineInfo info={info} loading={loading} error={error} user={user} />
    </ContentsBox>
  );
};

export default withRouter(HomeContainer);
