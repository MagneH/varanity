import { ActionType, createAction, createReducer } from 'typesafe-actions';
import cloneDeep from 'lodash/cloneDeep';
import { ArticleModel } from '../../pages/Article';
import { PageModel } from '../../pages/Page';

/**
 * ActionTypes
 */
export enum ActionTypes {
  GET = 'varanity/preview/GET',
  SET_ONE = 'varanity/preview/SET_ONE',
}

/**
 * State
 */
interface PreviewState {
  data: {
    [key: string]: ArticleModel | PageModel;
  };
}

export const initialState: Readonly<PreviewState> = {
  data: {},
};

/**
 * ActionCreators
 */
export const actionCreators = {
  getOne: createAction(ActionTypes.GET)(),
  setOne: createAction(ActionTypes.SET_ONE)<ArticleModel | PageModel>(),
};

/**
 * Reducers
 */
export const reducers = createReducer<PreviewState, ActionType<typeof actionCreators>>(initialState)
  .handleAction(actionCreators.getOne, state => ({ ...state }))
  .handleAction(actionCreators.setOne, (state, action) => {
    const nextState = cloneDeep(state);
    if (action.payload && action.payload._id) {
      nextState.data[action.payload._id] = action.payload;
    }
    return { ...nextState, isOffline: false };
  });

/**
 * Epics
 */
export const epics = {};
