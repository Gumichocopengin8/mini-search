import { useEffect, useState } from 'react';
import { Typography, Box, FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchGifSearchResultUsingGET } from 'api/giphy';
import { GiphyData } from 'interfaces/giphy/search';
import * as global from 'styles/global';
import PaginationView from '@/components/common/paginationView';
import SelectBoxField from '@/components/common/searchFields/selectBoxField';
import { GiphyFormTypes, ratingData } from 'data/giphy/data';
import ErrorStackbar from '@/components/common/ErrorSnackbar';

const GiphyHome = () => {
  const ITEM_LIMIT = 40;
  const [query, setQuery] = useState<string>('');
  const [rating, setRating] = useState<string>('g');
  const [giphyData, setGiphyData] = useState<GiphyData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<GiphyFormTypes>();

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!query) return;
      setIsError(false);
      try {
        const data = await fetchGifSearchResultUsingGET(query, rating, 'en', ITEM_LIMIT, page);
        if (!unmounted && data.meta.status === 200) {
          setGiphyData(data.data);
          setTotalHits(data.pagination.total_count);
        }
      } catch (err) {
        console.error(err);
        setIsError(true);
      }
    };
    func();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [query, page, rating]);

  const onPageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const onChangeRating = (event: SelectChangeEvent) => setRating(event.target.value as string);

  const onCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsError(false);
  };

  const onSubmit = ({ inputValue }: GiphyFormTypes) => {
    setPage(1);
    setQuery(inputValue);
  };

  const onClickTitle = () => {
    setQuery('');
    setRating('g');
    setPage(1);
    setTotalHits(0);
    setGiphyData([]);
    setIsError(false);
    reset();
  };

  return (
    <div css={global.Container}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} css={global.SearchFormBox}>
        <Typography variant="h6" component="h1" onClick={onClickTitle} style={{ cursor: 'pointer' }}>
          Giphy Search
        </Typography>
        <FormGroup row={true} css={global.SearchForm}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <SelectBoxField label={'Rating'} value={rating} keywords={ratingData} onChangeValue={onChangeRating} />
          </FormControl>
          <FormControl size="small">
            <MainInputField register={register('inputValue', { required: true })} placeholder={'Giphy'} />
          </FormControl>
        </FormGroup>
      </Box>
      {giphyData.length > 0 ? (
        <>
          <div css={global.ResultContainer}>
            <div css={Gallery}>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} css={GalleryColumn}>
                  {giphyData
                    .filter((_, i) => i % 4 === index)
                    .map((data) => (
                      <a key={data.id} href={data.images.original.webp} target="_blank" rel="noopener noreferrer">
                        <img src={data.images.original.webp} loading="lazy" css={ImageContent} />
                      </a>
                    ))}
                </div>
              ))}
            </div>
            <PaginationView page={page} totalHits={totalHits} itemLimit={ITEM_LIMIT} onPageChange={onPageChange} />
            <Typography variant="caption">Powered By GIPHY</Typography>
            <ErrorStackbar isError={isError} onCloseError={onCloseError} />
          </div>
        </>
      ) : (
        <div css={[global.ResultContainer, global.NoResultContainer]}>
          {!query && giphyData.length === 0 ? (
            <>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/76/Giphy_Logo_9.2016.svg"
                width={500}
                height={200}
                alt="giphy image"
              />
              <Typography variant="h6" component="div">
                Welcome to Giphy Search
              </Typography>
            </>
          ) : (
            <Typography variant="h6" component="div">
              No results
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

const Gallery = css({
  display: 'flex',
  gap: '0.5rem',
});

const GalleryColumn = css({
  width: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const ImageContent = css({
  width: '100%',
  height: '100%',
});

export default GiphyHome;
