import { Pagination, Stack } from '@mui/material';
import { css } from '@emotion/react';

interface Props {
  page: number;
  totalHits: number;
  itemLimit: number;
  API_CALL_LIMIT: number;
  onPageChange: (e: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationView = ({ page, totalHits, itemLimit, API_CALL_LIMIT, onPageChange }: Props) => {
  return (
    <Stack spacing={2} css={PagenationItem}>
      <Pagination
        shape="rounded"
        page={page}
        size="large"
        count={totalHits < API_CALL_LIMIT ? Math.ceil(totalHits / itemLimit) : API_CALL_LIMIT / itemLimit}
        onChange={onPageChange}
      />
    </Stack>
  );
};

const PagenationItem = css({
  padding: '4rem 0 0',
});

export default PaginationView;
