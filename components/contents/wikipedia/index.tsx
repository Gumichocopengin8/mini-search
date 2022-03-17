import { useEffect, useState } from 'react';
import { Typography, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { css } from '@emotion/react';
import MainInputField from '@/components/common/searchFields/mainInputField';
import { fetchWikiSearchResultUsingGET, fetchWikiPageSummaryUsingGET } from 'api/wikipedia';
import { WikipediaPageSummary } from 'interfaces/wikipedia/search';
import * as global from 'styles/global';

const WiKiHome = () => {
  const ITEM_LIMIT = 25;
  const [query, setQuery] = useState<string>('');
  const [wikiSummaries, setWikiSummaries] = useState<WikipediaPageSummary[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!query) return;
      setIsError(false);
      try {
        const searchResult = await fetchWikiSearchResultUsingGET(query, ITEM_LIMIT);
        const titlePromise = searchResult.titles.map((title) => fetchWikiPageSummaryUsingGET(title));
        const titleSummaries = await Promise.all(titlePromise);
        if (!unmounted) {
          console.log(searchResult);
          console.log(titleSummaries);
          setWikiSummaries(titleSummaries);
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
  }, [query]);

  const onSetQuery = (query: string) => setQuery(query);

  return (
    <div>
      {isError && <div>error</div>}
      <Typography variant="caption">Wikipedia</Typography>
      <MainInputField placeholder={'Wikipedia'} onSubmitFunc={onSetQuery} />

      {wikiSummaries.length > 0 ? (
        <>
          <Typography variant="subtitle2">Results</Typography>
          <div css={[global.Container, ArticleColumn]}>
            {wikiSummaries.map((summary) => (
              <Card sx={{ maxWidth: 500 }} key={summary.pageid}>
                <a css={Anchor} href={summary.content_urls.desktop.page} target="_blank" rel="noopener noreferrer">
                  <CardActionArea>
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
                      <Typography gutterBottom variant="h5" component="div">
                        {summary.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {summary.extract}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </a>
              </Card>
            ))}
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
  gap: '2rem',
});

const Anchor = css({
  textDecoration: 'none',
  color: 'darkgrey',
});

export default WiKiHome;
