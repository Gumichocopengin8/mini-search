import { useEffect, useState } from 'react';
import { Pagination, Stack, Typography } from '@mui/material';
import { css } from '@emotion/react';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchGifSearchResultUsingGET } from 'api/giphy';
import { GiphyData, PaginationInfo } from 'interfaces/giphy/search';

const GiphyHome = () => {
  const ITEM_LIMIT = 20;
  const [query, setQuery] = useState<string>('');
  const [rating, setRating] = useState<string>('g');
  const [giphyData, setGiphyData] = useState<GiphyData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({ total_count: 0, count: 0, offset: 0 });

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!query) return;
      const data = await fetchGifSearchResultUsingGET(query, rating, 'en', ITEM_LIMIT, page);
      if (!unmounted && data.meta.status === 200) {
        console.log(data.pagination);
        setGiphyData(data.data);
        setPaginationInfo(data.pagination);
      }
    };
    func();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [query, page]);

  const onSetQuery = (query: string) => {
    setQuery((state) => {
      if (state !== query) {
        setPage(1);
      }
      return query;
    });
  };

  const onPageChange = (e: any, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <Typography variant="caption">Powered By GIPHY</Typography>
      <MainInputField placeholder={'Giphy'} onSubmitFunc={onSetQuery} />

      {giphyData.length > 0 ? (
        <>
          <Typography variant="subtitle2" component="div" gutterBottom>
            {paginationInfo.total_count} results
          </Typography>
          <div css={Container}>
            <div css={Gallery}>
              {giphyData.map((data) => (
                <a key={data.id} href={data.images.original.webp}>
                  <img src={data.images.original.webp} css={ImageContent} />
                </a>
              ))}
            </div>
            <Stack spacing={2} css={PagenationItem}>
              <Pagination
                shape="rounded"
                page={page}
                size="large"
                count={Math.ceil(paginationInfo.total_count / ITEM_LIMIT)}
                onChange={onPageChange}
              />
            </Stack>
          </div>
        </>
      ) : (
        <div css={Container}>
          <div>No results</div>
        </div>
      )}
    </div>
  );
};

const Container = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const Gallery = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'inherit',
  gap: '1rem',
});

const ImageContent = css({
  height: '16vw',
  objectFit: 'contain',
});

const PagenationItem = css({
  padding: '4rem 0',
});

export default GiphyHome;
