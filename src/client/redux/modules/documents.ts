import { Action, ActionType, createAsyncAction, createReducer } from 'typesafe-actions';
import { ActionsObservable, ofType } from 'redux-observable';
import { of, OperatorFunction } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import produce from 'immer';
import { Boom } from '@hapi/boom';
import { PageModel } from '../../pages/Page';
import { ArticleModel } from '../../pages/Article';
import { TypedEpic } from '../types';

/**
 * ActionTypes
 */
export enum Actions {
  GET = 'varanity/documents/GET',
  GET_SUCCESS = 'varanity/documents/GET_SUCCESS',
  GET_FAIL = 'varanity/documents/GET_FAIL',
  GET_CANCEL = 'varanity/documents/GET_CANCEL',
  GET_BY_CATEGORY = 'varanity/documents/GET_BY_CATEGORY',
  GET_BY_CATEGORY_SUCCESS = 'varanity/documents/GET_BY_CATEGORY_SUCCESS',
  GET_BY_CATEGORY_FAIL = 'varanity/documents/GET_BY_CATEGORY_FAIL',
  GET_BY_CATEGORY_CANCEL = 'varanity/documents/GET_BY_CATEGORY_CANCEL',
}

/**
 * State
 */
interface DocumentsState {
  isLoading: boolean;
  data: {
    [key: string]: ArticleModel | PageModel;
  };
}

export const initialState: Readonly<DocumentsState> = {
  isLoading: false,
  data: {},
};

/**
 * ActionCreators
 */
export const actions = {
  getOne: createAsyncAction(
    [Actions.GET, (slug: string) => slug], // request payload creator
    [Actions.GET_SUCCESS, (res: ArticleModel | PageModel) => res], // success payload creator
    [Actions.GET_FAIL, (err: Error) => err], // failure payload creator
    Actions.GET_CANCEL, // optional cancel payload creator
  )(),
  getByCategory: createAsyncAction(
    [Actions.GET_BY_CATEGORY, (slug: string) => slug], // request payload creator
    [Actions.GET_BY_CATEGORY_SUCCESS, (res: ArticleModel[]) => res], // success payload creator
    [Actions.GET_BY_CATEGORY_FAIL, (err: Error) => err], // failure payload creator
    Actions.GET_BY_CATEGORY_CANCEL, // optional cancel payload creator
  )(),
};

/**
 * Reducers
 */
export const reducers = createReducer<DocumentsState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.getOne.request, (state = initialState) =>
    produce(state, (draftState) => {
      draftState.isLoading = true;
    }),
  )
  .handleAction(actions.getOne.success, (state = initialState, action) =>
    produce(state, (draftState) => {
      draftState.isLoading = false;
      draftState.data[action.payload._id] = action.payload;
    }),
  )
  .handleAction(actions.getOne.failure, (state = initialState) =>
    produce(state, (draftState) => {
      draftState.isLoading = false;
    }),
  )
  .handleAction(actions.getOne.cancel, (state = initialState) =>
    produce(state, (draftState) => {
      draftState.isLoading = false;
    }),
  )
  .handleAction(actions.getByCategory.request, (state = initialState) =>
    produce(state, (draftState) => {
      draftState.isLoading = true;
    }),
  )
  .handleAction(actions.getByCategory.success, (state = initialState, action) =>
    produce(state, (draftState) => {
      const responseMap = action.payload.reduce(
        (acc: Record<ArticleModel['slug']['current'], ArticleModel>, cur) => {
          acc[cur.slug.current] = cur;
          return acc;
        },
        {},
      );
      draftState.data = { ...draftState.data, ...responseMap };
      draftState.isLoading = false;
    }),
  )
  .handleAction(actions.getByCategory.failure, (state = initialState) =>
    produce(state, (draftState) => {
      draftState.isLoading = false;
    }),
  )
  .handleAction(actions.getByCategory.cancel, (state = initialState) =>
    produce(state, (draftState) => {
      draftState.isLoading = false;
    }),
  );

/**
 * Epics
 */
export const getDocumentEpic: TypedEpic = (action$: ActionsObservable<Action<any>>, state$) =>
  action$.pipe(
    ofType(Actions.GET),
    (withLatestFrom(state$) as unknown) as OperatorFunction<
      Action<any>,
      ActionType<typeof actions.getOne.request>[]
    >,
    switchMap(([action]: { payload: string }[]) =>
      ajax.get(`/api/v1/document/${action.payload}`).pipe(
        map(({ response }: { response: ArticleModel | PageModel }) =>
          actions.getOne.success(response),
        ),
        catchError(() => of(actions.getOne.failure(new Boom('Could not get document')))),
      ),
    ),
  );

export const getDocumentsByCategoryEpic: TypedEpic = (
  action$: ActionsObservable<Action<any>>,
  state$,
) =>
  action$.pipe(
    ofType(Actions.GET_BY_CATEGORY),
    (withLatestFrom(state$) as unknown) as OperatorFunction<
      Action<any>,
      ActionType<typeof actions.getByCategory.request>[]
    >,
    switchMap(([action]: { payload: string }[]) =>
      ajax.get(`/api/v1/documents/${action.payload}`).pipe(
        map(({ response }: { response: ArticleModel[] }) =>
          actions.getByCategory.success(response),
        ),
        catchError(() => of(actions.getByCategory.failure(new Boom('Could not get document')))),
      ),
    ),
  );

export const epics: TypedEpic[] = [getDocumentEpic, getDocumentsByCategoryEpic];
