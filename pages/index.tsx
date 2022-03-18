import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Divider } from '@mui/material';
import { css } from '@emotion/react';
import NavBar from '@/components/common/navbar';
import { APIType } from 'state/contextReducer';
import GiphyHome from '@/components/contents/giphy';
import WiKiHome from '@/components/contents/wikipedia';

const Home: NextPage = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<string>(APIType.wikipedia);

  useEffect(() => {
    if (!router.isReady) return;
    setCurrentTab(String(router.query?.ref ?? APIType.wikipedia));
  }, [router]);

  return (
    <div>
      <Head>
        <title>API Search</title>
        <meta name="description" content="API Search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={GridContainer}>
        <nav css={TabNavContainer}>
          <NavBar />
          <Divider orientation="vertical" />
        </nav>
        <main css={[MainContainer, Main]}>
          <div style={{ display: currentTab === 'giphy' ? 'block' : 'none' }}>
            <GiphyHome />
          </div>
          <div style={{ display: currentTab === 'wikipedia' ? 'block' : 'none' }}>
            <WiKiHome />
          </div>
        </main>
      </div>
    </div>
  );
};

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
  minWidth: '840px',
  height: '100vh',
  overflowY: 'hidden',
  boxSizing: 'border-box',
});

const Main = css({
  overflowY: 'scroll',
});

export default Home;
