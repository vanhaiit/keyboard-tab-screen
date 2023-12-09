import { UserProfile } from '@/features/profile/types';
import { baseQueryApi as api } from '@/store/baseQueryApi';
import { UniqueId, WearableNFTParams, WearableNFTResponse } from '../types';

export const nftApi = api.injectEndpoints({
  endpoints: build => ({
    getAccessIDS: build.query<number[], { unique_id: string }>({
      query: params => {
        return {
          url: 'get-asset-ids',
          params: params,
        };
      },
    }),
    fetchDecoratedPopos: build.mutation<any, UniqueId>({
      async queryFn(payload, _queryApi, _extraOptions, baseQuery) {
        return await baseQuery({
          url: 'decorated-popos/fetchDecoratedPopos',
          method: 'POST',
          body: payload,
        });
      },
    }),
    getWearableNFT: build.query<WearableNFTResponse[], WearableNFTParams>({
      query: params => {
        let url = 'wearable-nfts?';
        if (params?._limit) {
          url = url + `_limit=${params?._limit}&`;
        }
        if (params?._sort) {
          url = url + `_sort=${params?._sort}&`;
        }
        if (params?._start) {
          url = url + `_start=${params?._start}&`;
        }
        if (params?.assetId) {
          const paramsAssetId = params?.assetId
            ?.map((el: number) => `assetId_in[]=${el}`)
            .join('&');

          url = url + paramsAssetId;
        }
        return {
          url,
        };
      },
    }),
    getProFileByUniqueID: build.query<UserProfile[], WearableNFTParams>({
      query: params => {
        return {
          url: 'profiles',
          params: params,
        };
      },
    }),
  }),
});

export const {
  useGetAccessIDSQuery,
  useFetchDecoratedPoposMutation,
  useGetWearableNFTQuery,
  useGetProFileByUniqueIDQuery,
} = nftApi;
