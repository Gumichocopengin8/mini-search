import { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Typography, Box, FormControl, FormGroup, SelectChangeEvent, CircularProgress } from '@mui/material';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchGifSearchResultUsingGET } from 'api/giphy';
import { GiphyData } from 'interfaces/giphy/search';
import * as global from 'styles/global';
import PaginationView from '@/components/common/paginationView';
import SelectBoxField from '@/components/common/searchFields/selectBoxField';
import { GiphyFormTypes, ratingData } from 'data/giphy/data';
import ErrorStackbar from '@/components/common/errorSnackbar';
import { AppContext } from 'state/context';

const GiphyHome = () => {
  const ITEM_LIMIT = 40;
  const router = useRouter();
  const { ghipyStore, giphyDataDispatch } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState<string>(ghipyStore.queryParams.query);
  const [rating, setRating] = useState<string>(ghipyStore.queryParams.rating);
  const [giphyData, setGiphyData] = useState<GiphyData[]>(ghipyStore.giphyData);
  const [page, setPage] = useState<number>(ghipyStore.queryParams.page);
  const [totalHits, setTotalHits] = useState<number>(ghipyStore.queryParams.totalHits);
  const [isLoading, setIsLoding] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { register, handleSubmit, reset, setValue } = useForm<GiphyFormTypes>();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!router.isReady || ghipyStore.giphyData.length > 0) return;
    const query = String(router.query?.query ?? '');
    setSearchQuery(query);
    setRating(String(router.query?.rating ?? 'g'));
    setPage(Number(router.query?.page ?? 1));
    setValue('inputValue', query);
  }, [router]);

  useEffect(() => {
    if (ghipyStore.giphyData.length > 0) {
      router.replace({ pathname: '/giphy', query: { ...ghipyStore.queryParams } });
      setValue('inputValue', ghipyStore.queryParams.query);
    }
  }, []);

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!searchQuery) return;
      setIsError(false);
      setIsLoding(true);
      try {
        const data = await fetchGifSearchResultUsingGET(searchQuery, rating, 'en', ITEM_LIMIT, page);
        if (!unmounted && data.meta.status === 200) {
          setGiphyData(data.data);
          setTotalHits(data.pagination.total_count);
          setIsLoding(false);
          giphyDataDispatch({
            type: 'update',
            newState: data.data,
            queryParams: {
              query: searchQuery,
              rating: rating,
              page: page,
              totalHits: data.pagination.total_count,
            },
          });
        }
      } catch (err) {
        console.error(err);
        setIsError(false);
        setIsError(true);
      }
    };
    if (isMounted.current) {
      func();
    } else {
      isMounted.current = true;
    }
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [searchQuery, page, rating]);

  const onPageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    router.push({ pathname: '/giphy', query: { page: value, rating: rating, query: searchQuery } });
  };

  const onChangeRating = (event: SelectChangeEvent) => {
    const newRating = event.target.value as string;
    setRating(newRating);
    router.push({ pathname: '/giphy', query: { page: page, rating: newRating, query: searchQuery } });
  };

  const onCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setIsError(false);
  };

  const onSubmit = ({ inputValue }: GiphyFormTypes) => {
    setPage(1);
    setSearchQuery(inputValue);
    router.push({
      pathname: '/giphy',
      query: { query: inputValue, rating: rating, page: 1 },
    });
  };

  const onClickTitle = () => {
    setSearchQuery('');
    setRating('g');
    setPage(1);
    setTotalHits(0);
    setGiphyData([]);
    setIsError(false);
    reset();
    giphyDataDispatch({ type: 'clear', queryParams: { query: '', rating: 'g', page: 1, totalHits: 0 } });
    router.push({ pathname: '/giphy' });
  };

  return (
    <>
      <Head>
        <title>Giphy | API Search</title>
        <meta name="description" content="Giphy API Search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
        {isLoading ? (
          <div css={[global.ResultContainer, global.NoResultContainer]}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {giphyData.length > 0 ? (
              <div css={global.ResultContainer}>
                <div css={Gallery}>
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} css={GalleryColumn}>
                      {giphyData
                        .filter((_, i) => i % 4 === index)
                        .map((data) => (
                          <a
                            css={global.ClickAnimation}
                            key={data.id}
                            href={data.images.original.webp}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img src={data.images.original.webp} loading="lazy" css={ImageContent} />
                          </a>
                        ))}
                    </div>
                  ))}
                </div>
                <PaginationView
                  page={page}
                  totalHits={totalHits}
                  itemLimit={ITEM_LIMIT}
                  API_CALL_LIMIT={5000}
                  onPageChange={onPageChange}
                />
                <Typography variant="caption">Powered By GIPHY</Typography>
                <ErrorStackbar isError={isError} onCloseError={onCloseError} />
              </div>
            ) : (
              <div css={[global.ResultContainer, global.NoResultContainer]}>
                {!searchQuery && giphyData.length === 0 ? (
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
          </>
        )}
      </div>
    </>
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
