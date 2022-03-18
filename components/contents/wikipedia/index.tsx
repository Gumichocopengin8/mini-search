import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
import ErrorStackbar from '@/components/common/ErrorSnackbar';
import WikiCard from './wikiCard';
import { APIType } from 'state/contextReducer';

const WiKiHome = () => {
  const ITEM_LIMIT = 20;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lang, setLang] = useState<string>('en');
  const [page, setPage] = useState<number>(1);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [wikiSummaries, setWikiSummaries] = useState<WikipediaPageSummary[]>([]);
  const [isLoading, setIsLoding] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<WikiFormTypes>();

  useEffect(() => {
    if (!router.isReady) return;
    setSearchQuery(String(router.query?.query ?? ''));
    setLang(String(router.query?.lang ?? 'en'));
    setPage(Number(router.query?.page ?? 1));
  }, [router.isReady]);

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
        }
      } catch (err) {
        console.error(err);
        setIsLoding(false);
        setIsError(true);
      }
    };
    func();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [searchQuery, page, lang]);

  const onPageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    router.push({
      pathname: '/',
      query: { ref: APIType.wikipedia, query: searchQuery, lang: lang, page: value },
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
      pathname: '/',
      query: { ref: APIType.wikipedia, query: searchQuery, lang: newLang, page: page },
    });
  };

  const onSubmit = ({ inputValue }: WikiFormTypes) => {
    setPage(1);
    setSearchQuery(inputValue);
    router.push({
      pathname: '/',
      query: { ref: APIType.wikipedia, query: inputValue, lang: lang, page: 1 },
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
    router.push({
      pathname: '/',
      query: { ref: APIType.wikipedia },
    });
  };

  return (
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
  );
};

const ArticleColumn = css({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '2rem',
});

export default WiKiHome;
