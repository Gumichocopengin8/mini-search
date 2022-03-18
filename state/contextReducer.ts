export enum APIType {
  wikipedia = 'wikipedia',
  giphy = 'giphy',
}

export type TabViewProps = {
  currentTab: APIType;
};

export const reducer = (state: TabViewProps, action: { type: string }): TabViewProps => {
  switch (action.type) {
    case APIType.wikipedia:
      return { ...state, currentTab: APIType.wikipedia };
    case APIType.giphy:
      return { ...state, currentTab: APIType.giphy };

    default:
      return state;
  }
};

export const initialState: TabViewProps = {
  currentTab: APIType.wikipedia,
};
