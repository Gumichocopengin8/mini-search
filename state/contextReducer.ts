export enum APIType {
  spotity = 'Spotify',
  wikipedia = 'Wikipedia',
  giphy = 'Giphy',
  stackoverflow = 'Stack Overflow',
}

export type TabViewProps = {
  currentTab: APIType;
};

export const reducer = (state: TabViewProps, action: { type: string }): TabViewProps => {
  switch (action.type) {
    case APIType.spotity:
      return { ...state, currentTab: APIType.spotity };
    case APIType.wikipedia:
      return { ...state, currentTab: APIType.wikipedia };
    case APIType.giphy:
      return { ...state, currentTab: APIType.giphy };
    case APIType.stackoverflow:
      return { ...state, currentTab: APIType.stackoverflow };
    default:
      return state;
  }
};

export const initialState: TabViewProps = {
  currentTab: APIType.spotity,
};
