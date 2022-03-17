import { css } from '@emotion/react';
import type { AppProps } from 'next/app';
import { AppProvider } from 'state/context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <div css={Wrapper}>
        <Component {...pageProps} />
      </div>
    </AppProvider>
  );
}

const Wrapper = css({
  minWidth: '100%',
  minHeight: '100%',
  padding: 0,
  margin: 0,
  overflowY: 'hidden',
});

export default MyApp;
