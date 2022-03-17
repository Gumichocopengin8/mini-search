import { useContext, useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { APIType } from 'state/contextReducer';
import { AppContext } from 'state/context';

const NavBar = () => {
  const { dispatch } = useContext(AppContext);
  const [tabValue, setTabValue] = useState<number>(0);

  const onTabChange = (event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  const onChangeTab = (e: any) => dispatch({ type: e.target.dataset.label });

  return (
    <>
      <Box sx={{ display: 'flex', flexGrow: 1, bgcolor: 'background.paper' }}>
        <Tabs value={tabValue} onChange={onTabChange} orientation="vertical">
          {Object.values(APIType).map((val) => (
            <Tab key={val} label={val} data-label={val} onClick={onChangeTab} />
          ))}
        </Tabs>
      </Box>
    </>
  );
};

export default NavBar;
