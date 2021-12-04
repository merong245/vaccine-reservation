import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as vaccineAPI from '../lib/api/vaccine';

const CHANGE_FIELD = 'vaccineStatus/CHANGE_FIELD';
const [
  GET_REMAINING_VACCINE,
  GET_REMAINING_VACCINE_SUCCESS,
  GET_REMAINING_VACCINE_FAILURE,
] = createRequestActionTypes('vaccineStatus/GET_REMAINING_VACCINE');

export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key, // 변수
  value, // 변경할 값
}));
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

const getRemainingVaccineSaga = createRequestSaga(
  GET_REMAINING_VACCINE,
  vaccineAPI.getRemainingVaccine,
);
export function* vaccineStatusSaga() {
  yield takeLatest(GET_REMAINING_VACCINE, getRemainingVaccineSaga);
}

const initialState = {
  vaccine_type: '',
  residence: '',
  date: '',
  time: '',
  hospital_name: '',
  vaccine_list: null,
  error: null,
};

const vaccine_list = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { key, value } }) =>
      produce(state, (draft) => {
        draft[key] = value; // key를 value로
      }),
    [GET_REMAINING_VACCINE_SUCCESS]: (state, { payload: vaccine_list }) => ({
      ...state,
      vaccine_list,
    }),
    [GET_REMAINING_VACCINE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error: error,
    }),
  },
  initialState,
);

export default vaccine_list;
