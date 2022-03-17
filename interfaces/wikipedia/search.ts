export interface WikipediaSearchResult {
  keyword: string;
  titles: string[];
  titleLinks: string[];
}

export interface WikipediaPageSummary {
  type: string;
  title: string;
  displaytitle: string;
  wikibase_item: string;
  pageid: number;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  lang: string;
  description: string;
  content_urls: {
    desktop: {
      page: string;
    };
  };
  extract: string;
  extract_html: string;
}
