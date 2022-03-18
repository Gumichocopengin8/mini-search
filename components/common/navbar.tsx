import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { APIType } from 'state/contextReducer';

const NavBar = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState<number>(0);

  useEffect(() => {
    if (!router.isReady) return;
    const currentTab = String(router.query?.ref ?? APIType.wikipedia);
    setTabValue(currentTab === APIType.wikipedia ? 0 : 1);
  }, [router.isReady]);

  const onTabChange = (event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  const onChangeTab = (e: any) => {
    const label = e.target.dataset.label;
    router.push({
      pathname: '/',
      query: { ref: label },
    });
  };

  return (
    <div css={NavContainer}>
      <Typography variant="h6" gutterBottom component="div">
        API Search
      </Typography>
      <Box sx={{ display: 'flex', flexGrow: 1, bgcolor: 'background.paper' }}>
        <Tabs value={tabValue} onChange={onTabChange} orientation="vertical">
          {Object.values(APIType).map((val) => (
            <Tab key={val} label={val} data-label={val} onClick={onChangeTab} />
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
