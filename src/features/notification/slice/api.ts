import { baseQueryApi as api } from '@/store/baseQueryApi';
import { CommonQueryParams } from '@/types';
import { INotification } from '../types';

export const notificationApi = api.injectEndpoints({
  endpoints: build => ({
    getNotification: build.query<INotification[], CommonQueryParams>({
      query: (params: CommonQueryParams) => ({
        url: '/fetch-notifications',
        params,
      }),
      providesTags: ['notification'],
    }),

    removeNotification: build.mutation<any, { notificationId: string }>({
      query: payload => ({
        url: '/remove-notification',
        method: 'POST',
        body: payload,
      }),
    }),

    readAllNotification: build.mutation<undefined, undefined>({
      query: () => ({
        url: '/mark-all-read-notifications',
        method: 'POST',
      }),
      invalidatesTags: ['notification'],
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useRemoveNotificationMutation,
  useReadAllNotificationMutation,
} = notificationApi;
