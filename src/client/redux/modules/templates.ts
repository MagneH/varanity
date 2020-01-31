import { ActionType, createAction, createReducer } from 'typesafe-actions';
import cloneDeep from 'lodash/cloneDeep';
import { SanityDocument } from '@sanity/client';

export interface TemplateModel extends SanityDocument {
  templateSet: (PageTemplate | ArticleTemplate)[];
}

export interface ArticleTemplate {
  title: string;
  slug: { _type: string; current: string };
}

export interface PageTemplate {
  title: string;
  slug: { _type: string; current: string };
}

/**
 * ActionTypes
 */
export enum ActionTypes {
  GET = 'varanity/templates/GET',
  SET = 'varanity/templates/SET',
}

/**
 * State
 */
interface DocumentsState {
  data: {
    [key: string]: TemplateModel;
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
  setOne: createAction(ActionTypes.SET)<TemplateModel>(),
};

/**
 * Reducers
 */
export const reducers = createReducer<DocumentsState, ActionType<typeof actionCreators>>(
  initialState,
)
  .handleAction(actionCreators.getOne, state => ({ ...state }))
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
