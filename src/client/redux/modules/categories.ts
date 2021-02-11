import { ActionType, createAction, createReducer } from 'typesafe-actions';
import cloneDeep from 'lodash/cloneDeep';
import { SanityDocument } from '@sanity/client';

export interface CategoryModel extends SanityDocument {
  slug: { current: string; _type: string };
  title: string;
  parent: { _ref: string };
}

/**
 * ActionTypes
 */
export enum ActionTypes {
  GET = 'varanity/categories/GET',
  SET = 'varanity/categories/SET',
}

/**
 * State
 */
interface DocumentsState {
  data: {
    [key: string]: CategoryModel;
  };
}

export const initialState: Readonly<DocumentsState> = {
  data: {},
};

/**
 * ActionCreators
 */
export const actionCreators = {
  getOne: createAction(ActionTypes.GET)<string>(),
  setOne: createAction(ActionTypes.SET)<CategoryModel>(),
};

/**
 * Reducers
 */
export const reducers = createReducer<DocumentsState, ActionType<typeof actionCreators>>(
  initialState,
)
  .handleAction(actionCreators.getOne, (state) => ({ ...state }))
  .handleAction(actionCreators.setOne, (state, action) => {
    const nextState = cloneDeep(state);
    if (action.payload && action.payload._id) {
      nextState.data[action.payload._id] = action.payload;
    }
    return { ...state };
  });

/**
 * Epics
 */
