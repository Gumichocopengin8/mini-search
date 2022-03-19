import { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Typography, FormGroup, FormControl, Box, SelectChangeEvent, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { css } from '@emotion/react';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchWikiSearchResultUsingGET, fetchWikiPageSummaryUsingGET } from 'api/wikipedia';
import { WikipediaPageSummary } from 'interfaces/wikipedia/search';
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
  const [searchQuery, setSearchQuery] = useState<string>(wikiStore.queryParams.query);
  const [lang, setLang] = useState<string>(wikiStore.queryParams.lang);
  const [page, setPage] = useState<number>(wikiStore.queryParams.page);
  const [totalHits, setTotalHits] = useState<number>(wikiStore.queryParams.totalHits);
  const [wikiSummaries, setWikiSummaries] = useState<WikipediaPageSummary[]>(wikiStore.wikipediaPageSummaries);
  const [isLoading, setIsLoding] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { register, handleSubmit, reset, setValue } = useForm<WikiFormTypes>();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!router.isReady || wikiStore.wikipediaPageSummaries.length > 0) return;
    const query = String(router.query?.query ?? '');
    setSearchQuery(query);
    setLang(String(router.query?.lang ?? 'en'));
    setPage(Number(router.query?.page ?? 1));
    setValue('inputValue', query);
  }, [router]);

  useEffect(() => {
    if (wikiStore.wikipediaPageSummaries.length > 0) {
      router.replace({ pathname: '/wikipedia', query: { ...wikiStore.queryParams } });
      setValue('inputValue', wikiStore.queryParams.query);
    }
  }, []);

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!searchQuery) return;
      setIsError(false);
      setIsLoding(true);
      try {
        const searchResult = await fetchWikiSearchResultUsingGET(searchQuery, ITEM_LIMIT, page, lang);
        const titlePromise = searchResult.query.search.map((search) =>
          fetchWikiPageSummaryUsingGET(search.title, lang)
        );
        const titleSummaries = await Promise.all(titlePromise);
        if (!unmounted) {
          setWikiSummaries(titleSummaries);
          setTotalHits(searchResult.query.searchinfo.totalhits);
          setIsLoding(false);
          wikiSummaryDispatch({
            type: 'update',
            newState: titleSummaries,
            queryParams: {
              query: searchQuery,
              lang: lang,
              page: page,
              totalHits: searchResult.query.searchinfo.totalhits,
            },
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
  }, [searchQuery, page, lang]);

  const onPageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    router.push({
      pathname: '/wikipedia',
      query: { query: searchQuery, lang: lang, page: value },
    });
  };

  const onCloseError = (e?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsError(false);
  };

  const onChangeLang = (e: SelectChangeEvent) => {
    const newLang = e.target.value as string;
    setLang(newLang);
    router.push({
      pathname: '/wikipedia',
      query: { query: searchQuery, lang: newLang, page: page },
    });
  };

  const onSubmit = ({ inputValue }: WikiFormTypes) => {
    setPage(1);
    setSearchQuery(inputValue);
    router.push({
      pathname: '/wikipedia',
      query: { query: inputValue, lang: lang, page: 1 },
    });
  };

  const onClickTitle = () => {
    setSearchQuery('');
    setLang('en');
    setPage(1);
    setTotalHits(0);
    setWikiSummaries([]);
    setIsError(false);
    reset();
    wikiSummaryDispatch({ type: 'clear', queryParams: { query: '', lang: 'en', page: 1, totalHits: 0 } });
    router.push({ pathname: '/wikipedia' });
  };

  return (
    <>
      <Head>
        <title>Wikipedia | API Search</title>
        <meta name="description" content="API Search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={global.Container}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} css={global.SearchFormBox}>
          <Typography variant="h6" component="h1" onClick={onClickTitle} style={{ cursor: 'pointer' }}>
            Wikipedia Search
          </Typography>
          <FormGroup row={true} css={global.SearchForm}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <SelectBoxField label={'Language'} value={lang} keywords={languageData} onChangeValue={onChangeLang} />
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
            {wikiSummaries.length > 0 ? (
              <div css={global.ResultContainer}>
                <div css={ArticleColumn}>
                  {wikiSummaries.map((summary) => (
                    <WikiCard key={summary.pageid} summary={summary} />
                  ))}
                </div>
                <PaginationView
                  page={page}
                  totalHits={totalHits}
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
                {!searchQuery && wikiSummaries.length === 0 ? (
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
