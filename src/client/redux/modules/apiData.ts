import { ActionType, createAction, createReducer } from 'typesafe-actions';
import produce from 'immer';
import { TypedEpic } from '../types';

/**
 * ActionTypes
 */
export enum Actions {
  GET_NUMBER_OF_BOOKS = 'varan/apiData/GET_NUMBER_OF_BOOKS',
}

/**
 * State
 */
interface DocumentsState {
  isLoading: boolean;
  data: Record<string, number | string>;
}

export const initialState: Readonly<DocumentsState> = {
  isLoading: false,
  data: {
    numberOfBooks: Math.floor(Math.random() * Math.floor(1000000)),
    mostReadAuthor: 'Jules Verne',
    mostReadBook: 'Around The World In 80 days',
  },
};

/**
 * ActionCreators
 */
export const actions = {
  getNumberOfBooks: createAction(Actions.GET_NUMBER_OF_BOOKS)(),
};

/**
 * Reducers
 */
export const reducers = createReducer<DocumentsState, ActionType<typeof actions>>(
  initialState,
).handleAction(actions.getNumberOfBooks, (state = initialState) =>
  produce(state, (draftState) => {
    draftState.data.numberOfBooks = Math.floor(Math.random() * Math.floor(1000000));
  }),
);
/**
 * Epics
 */

export const epics: TypedEpic[] = [];
