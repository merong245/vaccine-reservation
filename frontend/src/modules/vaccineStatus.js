import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as vaccineAPI from '../lib/api/vaccine';

const CHANGE_FIELD = 'vaccineStatus/CHANGE_FIELD';
const INITIALIZE_STATUS = 'vaccineStatus/INITIALIZE_STATUS';
const [
  GET_REMAINING_VACCINE,
  GET_REMAINING_VACCINE_SUCCESS,
  GET_REMAINING_VACCINE_FAILURE,
] = createRequestActionTypes('vaccineStatus/GET_REMAINING_VACCINE');
const [RESERVATION, RESERVATION_SUCCESS, RESERVATION_FAILURE] =
  createRequestActionTypes('vaccineStatus/RESERVATION');

export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key, // 변수
  value, // 변경할 값
}));
export const initializeStatus = createAction(INITIALIZE_STATUS);
export const getRemainingVaccine = createAction(
  GET_REMAINING_VACCINE,
  ({ vaccine_type, residence, date, time, hospital_name }) => ({
    vaccine_type,
    residence,
    date,
    time,
    hospital_name,
  }),
);
export const reservation = createAction(
  RESERVATION,
  ({ residence, vaccine_type, date, time, hospital_name }) => ({
    residence,
    vaccine_type,
    date,
    time,
    hospital_name,
  }),
);

const getRemainingVaccineSaga = createRequestSaga(
  GET_REMAINING_VACCINE,
  vaccineAPI.getRemainingVaccine,
);
const reservationSaga = createRequestSaga(RESERVATION, vaccineAPI.reservation);
export function* vaccineStatusSaga() {
  yield takeLatest(GET_REMAINING_VACCINE, getRemainingVaccineSaga);
  yield takeLatest(RESERVATION, reservationSaga);
}

const initialState = {
  vaccine_type: '',
  residence: '',
  date: '',
  time: '',
  hospital_name: '',
  vaccine_list: null,
  error: null,
  reservation: null,
  reserv_error: null,
};

const vaccine_list = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { key, value } }) =>
      produce(state, (draft) => {
        draft[key] = value; // key를 value로
      }),
    [INITIALIZE_STATUS]: (state) => ({
      ...initialState,
    }),
    [GET_REMAINING_VACCINE_SUCCESS]: (state, { payload: vaccine_list }) => ({
      ...state,
      vaccine_list,
    }),
    [GET_REMAINING_VACCINE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error: error,
    }),
    // 예약 성공
    [RESERVATION_SUCCESS]: (state, { payload: reservation }) => ({
      ...state,
      error: null,
      reservation,
    }),
    // 예약 실패
    [RESERVATION_FAILURE]: (state, { payload: error }) => ({
      ...state,
      reserv_error: error,
    }),
  },
  initialState,
);

export default vaccine_list;
