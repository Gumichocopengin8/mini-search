import { useEffect, useState } from 'react';
import { Pagination, Stack, Typography } from '@mui/material';
import { css } from '@emotion/react';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchGifSearchResultUsingGET } from 'api/giphy';
import { GiphyData, PaginationInfo } from 'interfaces/giphy/search';
import * as global from 'styles/global';

const GiphyHome = () => {
  const ITEM_LIMIT = 40;
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
          <div css={global.Container}>
            <div css={Gallery}>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} css={GalleryColumn}>
                  {giphyData
                    .filter((_, i) => i % 4 === index)
                    .map((data) => (
                      <a key={data.id} href={data.images.original.webp}>
                        <img src={data.images.original.webp} loading="lazy" css={ImageContent} />
                      </a>
                    ))}
                </div>
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
        <div css={global.Container}>
          <div>No results</div>
        </div>
      )}
    </div>
  );
};

const Gallery = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'inherit',
  gap: '0.5rem',
});

const GalleryColumn = css({
  width: '20%',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  gap: '0.5rem',
});

const ImageContent = css({
  width: '100%',
  objectFit: 'contain',
});

const PagenationItem = css({
  padding: '4rem 0',
});

export default GiphyHome;
