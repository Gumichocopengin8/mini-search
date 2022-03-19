import Head from 'next/head';
import { Divider } from '@mui/material';
import { css } from '@emotion/react';
import NavBar from '@/components/common/navbar';
import type { AppProps } from 'next/app';
import { AppProvider } from 'state/context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <div css={Wrapper}>
        <>
          <Head>
            <title>Mini Search</title>
            <meta name="description" content="Mini Search" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div css={GridContainer}>
            <nav css={TabNavContainer}>
              <NavBar />
              <Divider orientation="vertical" />
            </nav>
            <main css={[MainContainer, Main]}>
              <Component {...pageProps} />
            </main>
          </div>
        </>
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

const GridContainer = css({
  display: 'grid',
  gridTemplateRows: '1fr',
  gridAutoColumns: 'auto 1fr',
  gridTemplateAreas: `'nav content' 'nav content'`,
  boxSizing: 'border-box',
});

const TabNavContainer = css({
  gridArea: 'nav',
  padding: '1rem 0',
  display: 'flex',
  gap: '0.5rem',
});

const MainContainer = css({
  gridArea: 'content',
  minWidth: '860px',
  height: '100vh',
  overflowY: 'hidden',
  boxSizing: 'border-box',
});

const Main = css({
  overflowY: 'scroll',
});

export default MyApp;
