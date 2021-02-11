import { ActionType, createAction, createReducer } from 'typesafe-actions';
import cloneDeep from 'lodash/cloneDeep';
import { SanityDocument } from '@sanity/client';

export interface AuthorModel extends SanityDocument {
  bio: any;
  image: any;
  name: any;
  slug: any;
}

/**
 * ActionTypes
 */
export enum ActionTypes {
  GET = 'varanity/authors/GET',
  SET = 'varanity/authors/SET',
}

/**
 * State
 */
interface DocumentsState {
  data: {
    [key: string]: AuthorModel;
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
  setOne: createAction(ActionTypes.SET)<AuthorModel>(),
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
