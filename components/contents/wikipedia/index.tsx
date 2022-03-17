import { useEffect, useState } from 'react';
import { Typography, Card, CardContent, CardMedia, CardActionArea, Snackbar, Alert } from '@mui/material';
import { css } from '@emotion/react';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchWikiSearchResultUsingGET, fetchWikiPageSummaryUsingGET } from 'api/wikipedia';
import { WikipediaPageSummary } from 'interfaces/wikipedia/search';
import * as global from 'styles/global';
import PaginationView from '@/components/common/paginationView';

const WiKiHome = () => {
  const ITEM_LIMIT = 20;
  const [query, setQuery] = useState<string>('');
  const [lang, setLang] = useState<string>('en');
  const [page, setPage] = useState<number>(1);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [wikiSummaries, setWikiSummaries] = useState<WikipediaPageSummary[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!query) return;
      setIsError(false);
      try {
        const searchResult = await fetchWikiSearchResultUsingGET(query, ITEM_LIMIT, page, lang);
        const titlePromise = searchResult.query.search.map((search) => fetchWikiPageSummaryUsingGET(search.title));
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

  const onCloseError = () => setIsError(false);

  return (
    <div>
      <div css={global.SearchBox}>
        <Typography variant="caption">Wikipedia</Typography>
        <MainInputField placeholder={'Wikipedia'} onSubmitFunc={onSetQuery} />
      </div>
      {wikiSummaries.length > 0 ? (
        <>
          <Typography variant="subtitle2" component="div" gutterBottom>
            {totalHits} results
          </Typography>
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
