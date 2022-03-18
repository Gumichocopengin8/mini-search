import { css } from '@emotion/react';

export const Container = css({
  padding: '4rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const SearchFormBox = css({
  position: 'sticky',
  top: 0,
  backgroundColor: 'white',
  zIndex: 10,
  boxShadow: '0px 10px 0.5rem  rgba(0, 0, 0, 0.1)',
});

export const SearchForm = css({
  padding: '1rem 4rem 0 4rem',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '1rem',
});
