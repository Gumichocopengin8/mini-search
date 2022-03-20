import { createContext, ReactNode, useReducer, useMemo, Dispatch } from 'react';
import { GihpyStore, giphyDataInitialState, giphyDataReducer, GiphyDataType } from './giphyContextReducer';
import { WikiStore, wikiSummaryReducer, wikiSummaryInitialState, WikiSummaryType } from './wikiContextReducer';

type Props = {
  children: ReactNode;
};

const AppContext = createContext<{
  wikiStore: WikiStore;
  wikiSummaryDispatch: Dispatch<WikiSummaryType>;
  gihpyStore: GihpyStore;
  giphyDataDispatch: Dispatch<GiphyDataType>;
}>({
  wikiStore: wikiSummaryInitialState,
  wikiSummaryDispatch: () => null,
  gihpyStore: giphyDataInitialState,
  giphyDataDispatch: () => null,
});

const AppProvider = ({ children }: Props) => {
  const [wikiState, wikiDispatch] = useReducer(wikiSummaryReducer, wikiSummaryInitialState);
  const [giphyState, giphyDispatch] = useReducer(giphyDataReducer, giphyDataInitialState);

  const value = useMemo(
    () => ({
      wikiStore: wikiState,
      wikiSummaryDispatch: wikiDispatch,
      gihpyStore: giphyState,
      giphyDataDispatch: giphyDispatch,
    }),
    [wikiState, giphyState]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
