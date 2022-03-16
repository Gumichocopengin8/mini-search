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
  width: '80%',
  maxWidth: '2000px',
  minHeight: '100vh',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
});

export default MyApp;
