import { css } from '@emotion/react';

export const Container = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const SearchBox = css({
  position: 'sticky',
  top: 0,
  backgroundColor: 'white',
  zIndex: 10,
});
