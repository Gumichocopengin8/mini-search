export interface WikipediaSearchResult {
  batchcomplete: string;
  continue: {
    sroffset: number;
  };
  query: {
    searchinfo: {
      totalhits: number;
    };
    search: {
      title: string;
      pageid: number;
      size: number;
      wordcount: number;
      timestamp: number;
    }[];
  };
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
