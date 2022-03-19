import { Typography, Card, CardContent, CardMedia } from '@mui/material';
import { css } from '@emotion/react';
import * as global from 'styles/global';
import { WikipediaPageSummary } from 'interfaces/wikipedia/search';

interface Props {
  summary: WikipediaPageSummary;
}

const WikiCard = ({ summary }: Props) => {
  return (
    <Card sx={{ maxWidth: 600, width: '30%', minWidth: 270 }} title={summary.title} css={global.ClickAnimation}>
      <a css={Anchor} href={summary.content_urls.desktop.page} target="_blank" rel="noopener noreferrer">
        <CardMedia
          component="img"
          height="250"
          image={
            summary.thumbnail?.source ?? 'https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg'
          }
          alt={summary.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" css={global.OneLineEllipsis}>
            {summary.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" css={global.MultiLineEllipsis}>
            {summary.extract}
          </Typography>
        </CardContent>
      </a>
    </Card>
  );
};

const Anchor = css({
  textDecoration: 'none',
  color: 'darkgrey',
});

export default WikiCard;
