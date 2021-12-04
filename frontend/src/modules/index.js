import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import auth, { authSaga } from './auth';
import loading from './loading';
import user, { userSaga } from './user';
import info, { userInfoSaga } from './info';
import vaccine_list, { vaccineStatusSaga } from './vaccineStatus';
//import result, { resultSaga } from './result';

const rootReducer = combineReducers({
  auth,
  loading,
  user,
  info,
  vaccine_list,
  //result,
});

export function* rootSaga() {
  yield all([
    authSaga(),
    userSaga(),
    userInfoSaga(),
    vaccineStatusSaga(),
    //resultSaga(),
  ]);
}

export default rootReducer;
