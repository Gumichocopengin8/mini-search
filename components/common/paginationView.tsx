import { Pagination, Stack } from '@mui/material';
import { css } from '@emotion/react';

interface Props {
  page: number;
  totalHits: number;
  itemLimit: number;
  onPageChange: (e: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationView = ({ page, totalHits, itemLimit, onPageChange }: Props) => {
  return (
    <Stack spacing={2} css={PagenationItem}>
      <Pagination
        shape="rounded"
        page={page}
        size="large"
        count={Math.ceil(totalHits / itemLimit)}
        onChange={onPageChange}
      />
    </Stack>
  );
};

const PagenationItem = css({
  padding: '4rem 0 0',
});

export default PaginationView;
