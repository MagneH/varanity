import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from './types';

const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export default useSelector;
