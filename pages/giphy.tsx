import { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Typography, Box, FormControl, FormGroup, SelectChangeEvent, CircularProgress } from '@mui/material';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchGifSearchResultUsingGET } from 'api/giphy';
import * as global from 'styles/global';
import PaginationView from '@/components/common/paginationView';
import SelectBoxField from '@/components/common/searchFields/selectBoxField';
import { GiphyFormTypes, ratingData } from 'data/giphy/data';
import ErrorStackbar from '@/components/common/errorSnackbar';
import { AppContext } from 'state/context';

const GiphyHome = () => {
  const ITEM_LIMIT = 40;
  const router = useRouter();
  const { gihpyStore, giphyDataDispatch } = useContext(AppContext);
  const [isLoading, setIsLoding] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { register, handleSubmit, reset, setValue } = useForm<GiphyFormTypes>();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    const paramQuery = String(router.query?.query ?? '');
    const paramRating = String(router.query?.rating ?? 'g');
    const paramPage = Number(router.query?.page ?? 1);
    setValue('inputValue', paramQuery);

    if (!paramQuery) {
      giphyDataDispatch({ type: 'clear' });
      return;
    }

    giphyDataDispatch({
      type: 'update_params',
      queryParams: { query: paramQuery, rating: paramRating, page: paramPage },
    });
  }, [router]);

  useEffect(() => {
    if (gihpyStore.giphyData.length > 0) {
      setValue('inputValue', gihpyStore.queryParams.query);
    }
  }, []);

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!gihpyStore.queryParams.query) return;
      setIsError(false);
      setIsLoding(true);
      try {
        const { query, page, rating } = gihpyStore.queryParams;
        const data = await fetchGifSearchResultUsingGET(query, rating, 'en', ITEM_LIMIT, page);
        if (!unmounted && data.meta.status === 200) {
          setIsLoding(false);
          giphyDataDispatch({
            type: 'update',
            newState: data.data,
            totalHits: data.pagination.total_count,
            queryParams: { ...gihpyStore.queryParams },
          });
        }
      } catch (err) {
        console.error(err);
        setIsLoding(false);
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
  }, [gihpyStore.queryParams.query, gihpyStore.queryParams.page, gihpyStore.queryParams.rating]);

  const onPageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    const newQueryParam = { ...gihpyStore.queryParams, page: value };
    giphyDataDispatch({
      type: 'update_params',
      queryParams: newQueryParam,
    });
    router.push({ pathname: '/giphy', query: newQueryParam });
  };

  const onChangeRating = (event: SelectChangeEvent) => {
    const newRating = event.target.value as string;
    const newQueryParam = { ...gihpyStore.queryParams, rating: newRating };
    giphyDataDispatch({
      type: 'update_params',
      queryParams: newQueryParam,
    });
    router.push({ pathname: '/giphy', query: newRating });
  };

  const onCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setIsError(false);
  };

  const onSubmit = ({ inputValue }: GiphyFormTypes) => {
    const newQueryParam = { ...gihpyStore.queryParams, page: 1, query: inputValue };
    giphyDataDispatch({
      type: 'update_params',
      queryParams: newQueryParam,
    });
    router.push({ pathname: '/giphy', query: newQueryParam });
  };

  const onClickTitle = () => {
    setIsError(false);
    reset();
    giphyDataDispatch({ type: 'clear' });
    router.push({ pathname: '/giphy' });
  };

  return (
    <>
      <Head>
        <title>Giphy | Mini Search</title>
        <meta name="description" content="Giphy Mini Search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div css={global.Container}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} css={global.SearchFormBox}>
          <Typography variant="h6" component="h1" onClick={onClickTitle} style={{ cursor: 'pointer' }}>
            Giphy Search
          </Typography>
          <FormGroup row={true} css={global.SearchForm}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <SelectBoxField
                label={'Rating'}
                value={gihpyStore.queryParams.rating}
                keywords={ratingData}
                onChangeValue={onChangeRating}
              />
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
            {gihpyStore.giphyData.length > 0 ? (
              <div css={global.ResultContainer}>
                <div css={Gallery}>
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} css={GalleryColumn}>
                      {gihpyStore.giphyData
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
                  page={gihpyStore.queryParams.page}
                  totalHits={gihpyStore.totalHits}
                  itemLimit={ITEM_LIMIT}
                  API_CALL_LIMIT={5000}
                  onPageChange={onPageChange}
                />
                <Typography variant="caption">Powered By GIPHY</Typography>
                <ErrorStackbar isError={isError} onCloseError={onCloseError} />
              </div>
            ) : (
              <div css={[global.ResultContainer, global.NoResultContainer]}>
                {!gihpyStore.queryParams.query && gihpyStore.giphyData.length === 0 ? (
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
