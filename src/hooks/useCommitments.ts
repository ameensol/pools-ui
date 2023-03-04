import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useQuery } from 'urql';
import { commitmentsAtom } from '../state/atoms';
import { useContractAddress } from '../hooks';
import { CommitmentsQuery, CommitmentsQueryDocument } from '../query';

export function useCommitments() {
  const [commitments, setCommitments] = useAtom(commitmentsAtom);
  const { contractAddress } = useContractAddress();

  const [result, executeCommitmentsQuery] = useQuery<CommitmentsQuery>({
    query: CommitmentsQueryDocument,
    variables: {
      lastLeafIndex: -1,
      contractAddress
    },
    requestPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (Array.isArray(result?.data?.commitments)) {
      setCommitments(result!.data!.commitments);
    }
  }, [result, setCommitments]);

  return { commitments, executeCommitmentsQuery };
}
