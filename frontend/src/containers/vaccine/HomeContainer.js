import React, { useEffect } from 'react';
import { ContentsBox } from '../../components/common/Contents';
import SideNavigator from '../../components/common/SideNavigator';
import VaccineInfo from '../../components/vaccine/VaccineInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getInfo, unloadInfo } from '../../modules/info';
import { withRouter } from 'react-router-dom';

const HomeContainer = ({ match }) => {
  const dispatch = useDispatch();
  const { info, error, loading, user } = useSelector(
    ({ info, loading, user }) => ({
      info: info.info,
      error: info.error,
      loading: loading['vaccine/GET_INFO'],
      user: user.user,
    }),
  );

  useEffect(() => {
    //    const { id } = match.params;
    //    dispatch(getInfo(id));

    // 언마운트 시 백신정보 없애기
    return () => {
      dispatch(unloadInfo());
    };
  }, [dispatch, match]);

  return (
    <ContentsBox>
      <SideNavigator />
      <VaccineInfo info={info} loading={loading} error={error} user={user} />
    </ContentsBox>
  );
};

export default withRouter(HomeContainer);
