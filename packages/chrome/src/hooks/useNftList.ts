import { gql, useQuery } from '@apollo/client';

const GET_NFT_LIST = gql`
  query GetNftList($address: Address!) {
    nfts(address: $address) {
      object {
        objectID
        type
        previousTransaction
      }
      name
      description
      url
    }
  }
`;

export type NftGqlDto = {
  object: {
    objectID: string;
    type: string;
    previousTransaction: string;
  };
  name: string;
  url: string;
  description: string;
};

export function useNftList(address: string) {
  const { data, error, loading } = useQuery<
    { nfts: NftGqlDto[] },
    {
      address: string;
    }
  >(GET_NFT_LIST, {
    variables: {
      address,
    },
    // pollInterval: 2000,
  });

  return {
    data: data?.nfts,
    error,
    loading,
  };
}
