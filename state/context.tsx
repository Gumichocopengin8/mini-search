import { createContext, ReactNode, useReducer, useMemo, Dispatch } from 'react';
import { WikiStore, wikiSummaryReducer, wikiSummaryInitialState, WikiSummaryType } from './contextReducer';

type Props = {
  children: ReactNode;
};

const AppContext = createContext<{
  wikiStore: WikiStore;
  wikiSummaryDispatch: Dispatch<WikiSummaryType>;
}>({
  wikiStore: wikiSummaryInitialState,
  wikiSummaryDispatch: () => null,
});

const AppProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(wikiSummaryReducer, wikiSummaryInitialState);

  const value = useMemo(
    () => ({
      wikiStore: state,
      wikiSummaryDispatch: dispatch,
    }),
    [state]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
