import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as vaccineAPI from '../lib/api/vaccine';

const CHANGE_FIELD = 'result/CHANGE_FIELD';
const [GET_RESULT, GET_RESULT_SUCCESS, GET_RESULT_FAILURE] =
  createRequestActionTypes('result/GET_RESULT');

export const changeField = createAction(
  CHANGE_FIELD,
  ({ options, key, value }) => ({
    options,
    key, // 변수
    value, // 변경할 값
  }),
);
export const getResult = createAction(
  GET_RESULT,
  ({ option0, option1, option2, option3 }) => ({
    option0,
    option1,
    option2,
    option3,
  }),
);

const getResultSaga = createRequestSaga(GET_RESULT, vaccineAPI.getResult);
export function* resultSaga() {
  yield takeLatest(GET_RESULT, getResultSaga);
}

const initialState = {
  options: {
    option0: 'Pie',
    option1: '',
    option2: '',
    option3: false,
  },
  result: null,
  error: null,
};

const result = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { options, key, value } }) =>
      produce(state, (draft) => {
        draft[options][key] = value; // key를 value로
      }),
    [GET_RESULT_SUCCESS]: (state, { payload: result }) => ({
      ...state,
      result,
    }),
    [GET_RESULT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState,
);

export default result;
