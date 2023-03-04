import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useQuery } from 'urql';
import { subsetRootsAtom } from '../state/atoms';
import { useContractAddress } from '../hooks';
import {
  SubsetRootsByTimestampQuery,
  SubsetRootsByTimestampDocument
} from '../query';

export function useSubsetRoots() {
  const [subsetRoots, setSubsetRoots] = useAtom(subsetRootsAtom);
  const { contractAddress } = useContractAddress();

  const [result, executeSubsetRootsQuery] =
    useQuery<SubsetRootsByTimestampQuery>({
      query: SubsetRootsByTimestampDocument,
      variables: {
        timestamp: 0,
        contractAddress: contractAddress.toLowerCase()
      },
      requestPolicy: 'cache-and-network'
    });

  useEffect(() => {
    if (Array.isArray(result?.data?.subsetRoots)) {
      setSubsetRoots(result!.data!.subsetRoots);
    }
  }, [result, setSubsetRoots]);

  return { subsetRoots, executeSubsetRootsQuery };
}
