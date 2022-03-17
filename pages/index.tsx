import { useContext } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { css } from '@emotion/react';
import TopTabBar from '@/components/common/topTabBar';
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
      <header css={Header}>
        <TopTabBar />
      </header>
      <main css={Main}>
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
  );
};

const Header = css({
  position: 'sticky',
  top: 0,
  zIndex: 100,
});

const Main = css({
  margin: '2rem 0',
  justifyContent: 'center',
  alignItems: 'center',
});

export default Home;
