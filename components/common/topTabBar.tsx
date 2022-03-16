import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const TopTabBar = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const labels = ['Spotify', 'Wikipedia', 'Giphy', 'StackOverflow', 'GitHub'];

  const onTabChange = (event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={tabValue} onChange={onTabChange} centered>
          {labels.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </Box>
    </>
  );
};

export default TopTabBar;
