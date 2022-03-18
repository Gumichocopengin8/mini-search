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
import { GiphyFormTypes, languageData, ratingData } from 'data/giphy/data';

const GiphyHome = () => {
  const ITEM_LIMIT = 40;
  const [query, setQuery] = useState<string>('');
  const [rating, setRating] = useState<string>('g');
  const [lang, setLang] = useState<string>('en');
  const [giphyData, setGiphyData] = useState<GiphyData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalHits, setTotalHits] = useState<number>(0);
  const { register, handleSubmit } = useForm<GiphyFormTypes>();

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (!query) return;
      const data = await fetchGifSearchResultUsingGET(query, rating, lang, ITEM_LIMIT, page);
      if (!unmounted && data.meta.status === 200) {
        setGiphyData(data.data);
        setTotalHits(data.pagination.total_count);
      }
    };
    func();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [query, page, rating, lang]);

  const onPageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const onChangeRating = (event: SelectChangeEvent) => setRating(event.target.value as string);
  const onChangeLang = (event: SelectChangeEvent) => setLang(event.target.value as string);

  const onSubmit = ({ inputValue }: GiphyFormTypes) => {
    setPage(1);
    setQuery(inputValue);
  };

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} css={global.SearchFormBox}>
        <FormGroup row={true} css={global.SearchForm}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <SelectBoxField label={'Rating'} value={rating} keywords={ratingData} onChangeValue={onChangeRating} />
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <SelectBoxField label={'Language'} value={lang} keywords={languageData} onChangeValue={onChangeLang} />
          </FormControl>
          <FormControl size="small">
            <MainInputField register={register('inputValue', { required: true })} placeholder={'Giphy'} />
          </FormControl>
        </FormGroup>
      </Box>
      {giphyData.length > 0 ? (
        <>
          <div css={global.Container}>
            <div css={Gallery}>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} css={GalleryColumn}>
                  {giphyData
                    .filter((_, i) => i % 4 === index)
                    .map((data) => (
                      <a key={data.id} href={data.images.original.webp}>
                        <img src={data.images.original.webp} loading="lazy" css={ImageContent} />
                      </a>
                    ))}
                </div>
              ))}
            </div>
            <PaginationView page={page} totalHits={totalHits} itemLimit={ITEM_LIMIT} onPageChange={onPageChange} />
            <Typography variant="caption">Powered By GIPHY</Typography>
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

const Gallery = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'inherit',
  gap: '0.5rem',
});

const GalleryColumn = css({
  width: '20%',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  gap: '0.5rem',
});

const ImageContent = css({
  width: '100%',
  objectFit: 'contain',
});

export default GiphyHome;
