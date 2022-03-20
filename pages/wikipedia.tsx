import { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Typography, FormGroup, FormControl, Box, SelectChangeEvent, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { css } from '@emotion/react';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchWikiSearchResultUsingGET, fetchWikiPageSummaryUsingGET } from 'api/wikipedia';
import * as global from 'styles/global';
import PaginationView from '@/components/common/paginationView';
import { languageData, WikiFormTypes } from 'data/wikipedia/data';
import SelectBoxField from '@/components/common/searchFields/selectBoxField';
import ErrorStackbar from '@/components/common/errorSnackbar';
import WikiCard from '@/components/contents/wikipedia/wikiCard';
import { AppContext } from 'state/context';

const WikiPediaHome = () => {
  const ITEM_LIMIT = 20;
  const router = useRouter();
  const { wikiStore, wikiSummaryDispatch } = useContext(AppContext);
  const [isLoading, setIsLoding] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { register, handleSubmit, reset, setValue } = useForm<WikiFormTypes>();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;

    const paramQuery = String(router.query?.query ?? '');
    const paramLang = String(router.query?.lang ?? 'en');
    const paramPage = Number(router.query?.page ?? 1);
    setValue('inputValue', paramQuery);

    if (!paramQuery) {
      wikiSummaryDispatch({ type: 'clear' });
      return;
    }

    wikiSummaryDispatch({
      type: 'update_params',
      queryParams: { query: paramQuery, lang: paramLang, page: paramPage },
    });
  }, [router]);

  useEffect(() => {
    if (wikiStore.wikipediaPageSummaries.length > 0) {
      setValue('inputValue', wikiStore.queryParams.query);
    }
  }, []);

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!wikiStore.queryParams.query) return;
      setIsError(false);
      setIsLoding(true);
      try {
        const { query, page, lang } = wikiStore.queryParams;
        const searchResult = await fetchWikiSearchResultUsingGET(query, ITEM_LIMIT, page, lang);
        const titlePromise = searchResult.query.search.map((search) =>
          fetchWikiPageSummaryUsingGET(search.title, lang)
        );
        const titleSummaries = await Promise.all(titlePromise);
        if (!unmounted) {
          setIsLoding(false);
          wikiSummaryDispatch({
            type: 'update',
            newState: titleSummaries,
            totalHits: searchResult.query.searchinfo.totalhits,
            queryParams: { ...wikiStore.queryParams },
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
  }, [wikiStore.queryParams.query, wikiStore.queryParams.page, wikiStore.queryParams.lang]);

  const onPageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    const newQueryParam = { ...wikiStore.queryParams, page: value };
    wikiSummaryDispatch({
      type: 'update_params',
      queryParams: newQueryParam,
    });
    router.push({ pathname: '/wikipedia', query: newQueryParam });
  };

  const onCloseError = (e?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setIsError(false);
  };

  const onChangeLang = (e: SelectChangeEvent) => {
    const newLang = e.target.value as string;
    const newQueryParams = { ...wikiStore.queryParams, page: 1, lang: newLang };
    wikiSummaryDispatch({ type: 'update_params', queryParams: newQueryParams });
    router.push({ pathname: '/wikipedia', query: newQueryParams });
  };

  const onSubmit = ({ inputValue }: WikiFormTypes) => {
    const newQueryParams = { ...wikiStore.queryParams, query: inputValue, page: 1 };
    wikiSummaryDispatch({
      type: 'update_params',
      queryParams: newQueryParams,
    });
    router.push({ pathname: '/wikipedia', query: newQueryParams });
  };

  const onClickTitle = () => {
    setIsError(false);
    reset();
    wikiSummaryDispatch({ type: 'clear' });
    router.push({ pathname: '/wikipedia' });
  };

  return (
    <>
      <Head>
        <title>Wikipedia | Mini Search</title>
        <meta name="description" content="Wikipedia Mini Search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={global.Container}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} css={global.SearchFormBox}>
          <Typography variant="h6" component="h1" onClick={onClickTitle} style={{ cursor: 'pointer' }}>
            Wikipedia Search
          </Typography>
          <FormGroup row={true} css={global.SearchForm}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <SelectBoxField
                label={'Language'}
                value={wikiStore.queryParams.lang}
                keywords={languageData}
                onChangeValue={onChangeLang}
              />
            </FormControl>
            <FormControl size="small">
              <MainInputField register={register('inputValue', { required: true })} placeholder={'Wikipedia'} />
            </FormControl>
          </FormGroup>
        </Box>
        {isLoading ? (
          <div css={[global.ResultContainer, global.NoResultContainer]}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {wikiStore.wikipediaPageSummaries.length > 0 ? (
              <div css={global.ResultContainer}>
                <div css={ArticleColumn}>
                  {wikiStore.wikipediaPageSummaries.map((summary) => (
                    <WikiCard key={summary.pageid} summary={summary} />
                  ))}
                </div>
                <PaginationView
                  page={wikiStore.queryParams.page}
                  totalHits={wikiStore.totalHits}
                  itemLimit={ITEM_LIMIT}
                  //  Up to 10000 search results are supported
                  // example: https://en.wikipedia.org/w/api.php?action=query&srsearch=s&srlimit=20&sroffset=10000&list=search&format=json&utf8=&origin=*
                  API_CALL_LIMIT={10000}
                  onPageChange={onPageChange}
                />
                <Typography variant="caption">Powered by Wikipedia</Typography>
                <ErrorStackbar isError={isError} onCloseError={onCloseError} />
              </div>
            ) : (
              <div css={[global.ResultContainer, global.NoResultContainer]}>
                {!wikiStore.queryParams.query && wikiStore.wikipediaPageSummaries.length === 0 ? (
                  <>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg"
                      width={240}
                      height={240}
                      alt="wiki image"
                    />
                    <Typography variant="h6" component="div">
                      Welcome to Wikipedia Search
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

const ArticleColumn = css({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '2rem',
});

export default WikiPediaHome;
