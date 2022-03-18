import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Snackbar,
  Alert,
  FormGroup,
  FormControl,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { css } from '@emotion/react';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchWikiSearchResultUsingGET, fetchWikiPageSummaryUsingGET } from 'api/wikipedia';
import { WikipediaPageSummary } from 'interfaces/wikipedia/search';
import * as global from 'styles/global';
import PaginationView from '@/components/common/paginationView';
import { languageData, WikiFormTypes } from 'data/wikipedia/data';
import SelectBoxField from '@/components/common/searchFields/selectBoxField';

const WiKiHome = () => {
  const ITEM_LIMIT = 20;
  const [query, setQuery] = useState<string>('');
  const [lang, setLang] = useState<string>('en');
  const [page, setPage] = useState<number>(1);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [wikiSummaries, setWikiSummaries] = useState<WikipediaPageSummary[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<WikiFormTypes>();

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!query) return;
      setIsError(false);
      try {
        const searchResult = await fetchWikiSearchResultUsingGET(query, ITEM_LIMIT, page, lang);
        const titlePromise = searchResult.query.search.map((search) =>
          fetchWikiPageSummaryUsingGET(search.title, lang)
        );
        const titleSummaries = await Promise.all(titlePromise);
        if (!unmounted) {
          setWikiSummaries(titleSummaries);
          setTotalHits(searchResult.query.searchinfo.totalhits);
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
  }, [query, page, lang]);

  const onPageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const onCloseError = () => setIsError(false);

  const onChangeLang = (e: SelectChangeEvent) => setLang(e.target.value as string);

  const onSubmit = ({ inputValue }: WikiFormTypes) => {
    setPage(1);
    setQuery(inputValue);
  };

  return (
    <div>
      <div>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} css={global.SearchFormBox}>
          <FormGroup row={true} css={global.SearchForm}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <SelectBoxField label={'Language'} value={lang} keywords={languageData} onChangeValue={onChangeLang} />
            </FormControl>
            <FormControl size="small">
              <MainInputField register={register('inputValue', { required: true })} placeholder={'Wikipedia'} />
            </FormControl>
          </FormGroup>
        </Box>
      </div>
      {wikiSummaries.length > 0 ? (
        <>
          <div css={global.Container}>
            <div css={ArticleColumn}>
              {wikiSummaries.map((summary) => (
                <Card sx={{ maxWidth: 500, width: 500 }} key={summary.pageid}>
                  <CardActionArea>
                    <a css={Anchor} href={summary.content_urls.desktop.page} target="_blank" rel="noopener noreferrer">
                      <CardMedia
                        component="img"
                        height="250"
                        image={
                          summary.thumbnail?.source ??
                          'https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg'
                        }
                        alt={summary.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {summary.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {summary.extract}
                        </Typography>
                      </CardContent>
                    </a>
                  </CardActionArea>
                </Card>
              ))}
            </div>
            <PaginationView page={page} totalHits={totalHits} itemLimit={ITEM_LIMIT} onPageChange={onPageChange} />
            <Typography variant="caption">Powered by Wikipedia</Typography>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={isError}
              autoHideDuration={3000}
              onClick={onCloseError}
            >
              <Alert variant="filled" onClick={onCloseError} severity="error" sx={{ width: '100%' }}>
                Data fetch error
              </Alert>
            </Snackbar>
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

const ArticleColumn = css({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '2rem',
});

const Anchor = css({
  textDecoration: 'none',
  color: 'darkgrey',
});

export default WiKiHome;
