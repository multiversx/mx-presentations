import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { REHYDRATE } from 'redux-persist';
import { AccountType } from '@multiversx/sdk-dapp/types';
import { IPlainTransactionObject } from '@multiversx/sdk-core/out';
import { ExpandedTransactionType } from 'types/transactions';

export const USER_ACCOUNT_TAG = 'USER_ACCOUNT_TAG';
export const USER_TRANSACTIONS_TAG = 'USER_TRANSACTIONS_TAG';

const baseUrl = 'https://devnet-api.multiversx.com';

export const RootApi = createApi({
  reducerPath: 'API',
  //this will keep the unused data in store and will act as a serve-while-revalidate cache
  keepUnusedDataFor: 999999999999,
  refetchOnMountOrArgChange: 10000,
  baseQuery: fetchBaseQuery({ baseUrl }),

  tagTypes: [USER_ACCOUNT_TAG, USER_TRANSACTIONS_TAG],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE && action.payload) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getMultiversxAccount: builder.query<AccountType, string>({
      query: (address) => {
        return `/accounts/${address}`;
      },
      providesTags: [USER_ACCOUNT_TAG]
    }),
    getMultiversxTransactions: builder.query<ExpandedTransactionType[], string>(
      {
        query: (address) => `accounts/${address}/transactions?from=0&size=10`,
        providesTags: [USER_TRANSACTIONS_TAG]
      }
    ),
    getMultiversxTransactionByHash: builder.query<
      ExpandedTransactionType,
      string
    >({
      query: (txHash) => `/transactions/${txHash}`,
      providesTags: [USER_TRANSACTIONS_TAG]
    }),
    sendMultiversxTransaction: builder.mutation<
      { txHash: string },
      IPlainTransactionObject
    >({
      query: (transaction) => {
        return {
          url: '/transactions',
          method: 'POST',
          body: transaction
        };
      },
      invalidatesTags: [USER_ACCOUNT_TAG, USER_TRANSACTIONS_TAG]
    })
  })
});

export const {
  useGetMultiversxAccountQuery,
  useGetMultiversxTransactionsQuery,
  useGetMultiversxTransactionByHashQuery,
  useLazyGetMultiversxAccountQuery,
  useSendMultiversxTransactionMutation
} = RootApi;
