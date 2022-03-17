import { useContext } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Divider } from '@mui/material';
import { css } from '@emotion/react';
import NavBar from '@/components/common/navbar';
import { AppContext } from 'state/context';
import { APIType } from 'state/contextReducer';
import GiphyHome from '@/components/contents/giphy';
import WiKiHome from '@/components/contents/wikipedia';
import SpotifyHome from '@/components/contents/spotify';

const Home: NextPage = () => {
  const { apiType } = useContext(AppContext);

  return (
    <div>
      <Head>
        <title>Search</title>
        <meta name="description" content="API Search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={GridContainer}>
        <nav css={TabNavContainer}>
          <NavBar />
          <Divider orientation="vertical" />
        </nav>
        <main css={[MainContainer, Main]}>
          <div style={{ display: apiType.currentTab === APIType.giphy ? 'block' : 'none' }}>
            <GiphyHome />
          </div>
          <div style={{ display: apiType.currentTab === APIType.wikipedia ? 'block' : 'none' }}>
            <WiKiHome />
          </div>
          <div style={{ display: apiType.currentTab === APIType.spotity ? 'block' : 'none' }}>
            <SpotifyHome />
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
  overflowY: 'hidden',
  height: '100vh',
  boxSizing: 'border-box',
});

const Main = css({
  justifyContent: 'center',
  alignItems: 'center',
  overflowY: 'auto',
});

export default Home;
