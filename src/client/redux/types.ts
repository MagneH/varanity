import { Epic } from 'redux-observable';
import { Action } from 'typesafe-actions';
import * as services from '../services';
import { rootReducer } from './index';
import { actionCreators } from './modules/application';

// Types
export type RootState = ReturnType<typeof rootReducer>;
export type RootAction = typeof actionCreators;
// export type Actions = { [P in keyof typeof modules]: typeof modules[P]['Actions'] };
export type Actions = any;
export type TypedEpic = Epic<Action<Actions>, Action<Actions>, RootState, typeof services>;
