import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { AppContext } from 'state/context';

const NavBar = () => {
  const router = useRouter();
  const { wikiStore, gihpyStore } = useContext(AppContext);
  const [tabValue, setTabValue] = useState<number>(0);

  useEffect(() => {
    switch (router.pathname) {
      case `/wikipedia`:
        setTabValue(0);
        break;
      case `/giphy`:
        setTabValue(1);
        break;
      default: // 404 page
        setTabValue(100);
        break;
    }
  }, [router]);

  const onTabChange = (e: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push({ pathname: `/wikipedia`, query: { ...wikiStore.queryParams } });
        break;
      case 1:
        router.push({ pathname: `/giphy`, query: { ...gihpyStore.queryParams } });
        break;
      default:
        break;
    }
    setTabValue(newValue);
  };

  return (
    <div css={NavContainer}>
      <Typography variant="h6" gutterBottom component="div">
        Mini Search
      </Typography>
      <Box sx={{ display: 'flex', flexGrow: 1, bgcolor: 'background.paper' }}>
        <Tabs value={tabValue} onChange={onTabChange} orientation="vertical">
          {['wikipedia', 'giphy'].map((val) => (
            <Tab key={val} label={val} data-label={val} />
          ))}
        </Tabs>
      </Box>
    </div>
  );
};

const NavContainer = css({
  padding: '0 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export default NavBar;
