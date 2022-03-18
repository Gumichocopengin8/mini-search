import { Pagination, Stack } from '@mui/material';
import { css } from '@emotion/react';

interface Props {
  page: number;
  totalHits: number;
  itemLimit: number;
  onPageChange: (e: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationView = ({ page, totalHits, itemLimit, onPageChange }: Props) => {
  //  Up to 10000 search results are supported
  // example: https://en.wikipedia.org/w/api.php?action=query&srsearch=s&srlimit=20&sroffset=10000&list=search&format=json&utf8=&origin=*
  const WIKIPEDIA_API_LIMIT = 10000;

  return (
    <Stack spacing={2} css={PagenationItem}>
      <Pagination
        shape="rounded"
        page={page}
        size="large"
        count={totalHits < WIKIPEDIA_API_LIMIT ? Math.ceil(totalHits / itemLimit) : WIKIPEDIA_API_LIMIT / itemLimit}
        onChange={onPageChange}
      />
    </Stack>
  );
};

const PagenationItem = css({
  padding: '4rem 0 0',
});

export default PaginationView;
