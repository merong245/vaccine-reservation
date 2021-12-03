import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as vaccineAPI from '../lib/api/vaccine';
import { takeLatest } from 'redux-saga/effects';

const [GET_USER_INFO, GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILURE] =
  createRequestActionTypes('vaccine/GET_USER_INFO');

export const getUserInfo = createAction(GET_USER_INFO);

const getUserInfoSaga = createRequestSaga(
  GET_USER_INFO,
  vaccineAPI.getUserInfo,
);
export function* userInfoSaga() {
  yield takeLatest(GET_USER_INFO, getUserInfoSaga);
}

const initialState = {
  info: null,
  error: null,
};

const info = handleActions({
  [GET_USER_INFO_SUCCESS]: (state, { payload: info }) => ({
    ...state,
    info,
  }),
  // 회원가입 실패
  [GET_USER_INFO_FAILURE]: (state, { payload: error }) => ({
    ...state,
    error: error,
  }),
  initialState,
});

export default info;
