import { css } from '@emotion/react';

export const Container = css({
  padding: '4rem 4rem 0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const SearchBox = css({
  padding: '1rem 4rem 0 4rem',
  position: 'sticky',
  top: 0,
  backgroundColor: 'white',
  zIndex: 10,
  boxShadow: '0px 10px 0.5rem  rgba(0, 0, 0, 0.1)',
});
