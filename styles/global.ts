import { css } from '@emotion/react';

export const Container = css({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

export const ResultContainer = css({
  padding: '5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const SearchFormBox = css({
  padding: '0 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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

export const NoResultContainer = css({
  flex: 1,
});

export const OneLineEllipsis = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const MultiLineEllipsis = css({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 5,
  overflow: 'hidden',
});

export const ClickAnimation = css`
  transition: 0.3s;

  &:active {
    transform: scale(0.9);
  }
`;
