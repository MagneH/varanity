import { Action, ActionType, createAction, createReducer } from 'typesafe-actions';
import cloneDeep from 'lodash/cloneDeep';
import { ActionsObservable, ofType } from 'redux-observable';
import { ObservableInput } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { SanityDocument } from '@sanity/client';
import { PageModel } from '../../pages/Page';
import { ArticleModel } from '../../pages/Article';

/**
 * ActionTypes
 */
export enum ActionTypes {
  GET = 'varanity/documents/GET',
  SET_ONE = 'varanity/documents/SET_ONE',
  GET_BY_CATEGORY = 'varanity/documents/GET_BY_CATEGORY',
  SET_BY_CATEGORY = 'varanity/documents/SET_BY_CATEGORY',
}

/**
 * State
 */
interface DocumentsState {
  data: {
    [key: string]: ArticleModel | PageModel;
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
  setOne: createAction(ActionTypes.SET_ONE)<ArticleModel | PageModel>(),
  getByCategory: createAction(ActionTypes.GET_BY_CATEGORY)<string>(),
  setByCategory: createAction(ActionTypes.SET_BY_CATEGORY)<ArticleModel[]>(),
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
  })
  .handleAction(actionCreators.getByCategory, state => ({ ...state }))
  .handleAction(actionCreators.setByCategory, (state, action) => {
    const nextState = cloneDeep(state);
    if (action.payload) {
      const responseMap = action.payload.reduce(
        (acc: Record<ArticleModel['slug']['current'], ArticleModel>, cur) => {
          acc[cur.slug.current] = cur;
          return acc;
        },
        {},
      );
      nextState.data = { ...nextState.data, ...responseMap };
    }
    return { ...nextState };
  });

/**
 * Epics
 */
export const epics = {
  getDocumentEpic: (action$: ActionsObservable<Action<any>>, state$: ObservableInput<any>) =>
    action$.pipe(
      ofType(ActionTypes.GET),
      withLatestFrom(state$),
      mergeMap(([action]: { payload: string; meta: { slug: string } }[]) =>
        ajax.get(`/api/v1/document/${action.payload}`).pipe(
          map(({ response }) => {
            console.log('Observable: ', response);
            return actionCreators.setOne(response);
          }),
        ),
      ),
    ),
  getDocumentsByCategoryEpic: (action$: ActionsObservable<Action<any>>, state$: ObservableInput<any>) =>
    action$.pipe(
      ofType(ActionTypes.GET_BY_CATEGORY),
      withLatestFrom(state$),
      mergeMap(([action]: { payload: string; meta: { slug: string } }[]) =>
        ajax.get(`/api/v1/documents/${action.payload}`).pipe(
          map((res) => {
            console.log('Observable: ', res);
            const { response } = res
            return actionCreators.setByCategory(response);
          }),
        ),
      ),
    ),
};
