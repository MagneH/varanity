import { Action, combineReducers } from 'redux';
import { combineEpics, Epic } from 'redux-observable';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import * as services from '../services';
import * as router from './modules/router';
import * as application from './modules/application';
import * as previews from './modules/previews';
import * as documents from './modules/documents';
import * as templates from './modules/templates';
import * as authors from './modules/authors';
import * as categories from './modules/categories';
import * as apiData from './modules/apiData';

// Register modules
const modules = {
  application,
  router,
  previews,
  documents,
  templates,
  authors,
  categories,
  apiData,
};

// Exports
export const rootReducer = combineReducers(
  mapValues(
    pickBy(modules, (v: any) => !!v.reducers),
    (v: any) => v.reducers,
  ) as {
    [Q in {
      [P in keyof typeof modules]: typeof modules[P] extends { reducers: any } ? P : never;
    }[keyof typeof modules]]: typeof modules[Q]['reducers'];
  },
);
export const rootEpic = combineEpics(
  ...Object.values(
    mapValues(
      pickBy(modules, (v: any) => !!v.epics),
      (v: any) => v.epics,
    ),
  ).reduce<TypedEpic[]>((acc, cur) => acc.concat(Object.values(cur)), []),
);

// Types
export type RootState = ReturnType<typeof rootReducer>;
export type TypedEpic<CustomState = RootState, CustomDependencies = typeof services> = Epic<
  Action<ActionTypes>,
  Action<ActionTypes>,
  CustomState,
  CustomDependencies
>;
export type ActionTypes = {
  [Q in {
    [P in keyof typeof modules]: typeof modules[P] extends { ActionTypes: any } ? P : never;
  }[keyof typeof modules]]: typeof modules[Q]['ActionTypes'];
};
