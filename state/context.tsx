import { createContext, ReactNode, useReducer, useMemo, Dispatch } from 'react';
import { TabViewProps, initialState, reducer, APIType } from './contextReducer';

type Props = {
  children: ReactNode;
};

const AppContext = createContext<{
  apiType: TabViewProps;
  dispatch: Dispatch<{ type: string }>;
}>({
  apiType: initialState,
  dispatch: () => null,
});

const AppProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(
    () => ({
      apiType: state,
      dispatch,
    }),
    [state]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
