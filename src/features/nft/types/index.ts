export interface UniqueId {
  unique_id?: string;
  _limit?: number;
}

export interface WearableNfts {
  assetId: number;
  boosts: number;
  id: string;
  nft_gallery: string;
  rarity: string;
  type: string;
  image?: string;
}

export interface DecoratedPopos {
  bottom?: any;
  data?: any;
  hair_accessory?: any;
  id?: string;
  popo_nft?: any;
  profile?: any;
  prop_accessory?: any;
  type?: string;
  wearable_nfts?: WearableNfts[];
  assetId?: number;
  attached?: boolean;
}

export interface WearableNFTResponse {
  assetId: number;
  boosts: number;
  id: string;
  rarity: string;
  type: string;
  popo_nft?: any;
  attached?: boolean;
  nft_gallery: {
    id: string;
    image: {
      url: string;
      id: string;
    };
  };
}

export interface WearableNFTParams {
  _limit: number;
  _sort: string;
  _start: number;
  assetId?: number[];
  unique_id?: string;
}

export enum FilterStatus {
  ATTACHED = 'ATTACHED',
  AVAILABLE = 'AVAILABLE',
  ALL = '',
}

export enum FilterType {
  ALL = '',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  HAIR = 'HAIR',
  PROP = 'PROP',
}
