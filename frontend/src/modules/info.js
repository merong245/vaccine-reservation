import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as vaccineAPI from '../lib/api/vaccine';
import { takeLatest } from 'redux-saga/effects';

const [GET_USER_INFO, GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILURE] =
  createRequestActionTypes('info/GET_USER_INFO');
const [
  COMPLETE_RESERVATION,
  COMPLETE_RESERVATION_SUCCESS,
  COMPLETE_RESERVATION_FAILURE,
] = createRequestActionTypes('info/COMPLETE_RESERVATION');

export const getUserInfo = createAction(GET_USER_INFO);
export const completeReservation = createAction(
  COMPLETE_RESERVATION,
  ({ vaccination_number }) => ({ vaccination_number }),
);

const getUserInfoSaga = createRequestSaga(
  GET_USER_INFO,
  vaccineAPI.getUserInfo,
);
const completeReservationSaga = createRequestSaga(
  COMPLETE_RESERVATION,
  vaccineAPI.completeReservation,
);
export function* userInfoSaga() {
  yield takeLatest(GET_USER_INFO, getUserInfoSaga);
  yield takeLatest(COMPLETE_RESERVATION, completeReservationSaga);
}

const initialState = {
  info: null,
  error: null,
};

const info = handleActions(
  {
    [GET_USER_INFO_SUCCESS]: (state, { payload: info }) => ({
      ...state,
      info,
    }),
    [GET_USER_INFO_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error: error,
    }),
    [COMPLETE_RESERVATION_SUCCESS]: (state, { payload: info }) => ({
      ...state,
      info,
    }),
    [COMPLETE_RESERVATION_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error: error,
    }),
  },
  initialState,
);

export default info;
