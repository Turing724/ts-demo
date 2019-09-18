export interface HomeMobxStore {
  bannerList: bannerList[];
  getBannerList(): void;
}

export interface bannerList {
  id: number;
  url: string;
}
