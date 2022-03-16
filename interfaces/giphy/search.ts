export interface GiphyData {
  type: string;
  id: string;
  slug: string;
  url: string;
  bitly_url: string;
  embed_url: string;
  source: string;
  rating: string;
  title: string;
  images: Image;
}

export interface Image {
  original: {
    width: string;
    height: string;
    size: string;
    frames: string;
    mp4: string;
    webp: string;
  };
  preview: {
    mp4: string;
    width: string;
    height: string;
  };
  preview_gif: {
    url: string;
    width: string;
    height: string;
  };
}

export interface PaginationInfo {
  offset: number;
  total_count: number;
  count: number;
}

export interface Meta {
  msg: string;
  status: number;
  response_id: string;
}

export interface GiphySearchResult {
  data: GiphyData[];
  pagination: PaginationInfo;
  meta: Meta;
}
