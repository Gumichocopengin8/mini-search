import { useContext } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { css } from '@emotion/react';
import TopTabBar from '@/components/common/topTabBar';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { AppContext } from 'state/context';

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
        <div>main</div>
        <div>{apiType.currentTab}</div>
        <MainInputField />
      </main>
    </div>
  );
};

const Header = css({
  position: 'sticky',
  top: 0,
});

const Main = css({
  height: '100vh',
  padding: '4rem 0',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export default Home;
