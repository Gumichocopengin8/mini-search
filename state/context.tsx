import { useRouter } from 'next/router';
import { createContext, ReactNode, useReducer, useMemo, useEffect, Dispatch } from 'react';
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
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!router.isReady) return;
    const queryRef = String(router.query?.ref ?? APIType.wikipedia);
    dispatch({ type: queryRef === APIType.wikipedia ? APIType.wikipedia : APIType.giphy });
  }, [router.isReady]);

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
