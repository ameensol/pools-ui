import { useEffect } from 'react';
import { useQuery } from 'urql';
import { useAtom } from 'jotai';
import { recentWithdrawalAtom, subsetMetadataAtom } from '../state';
import { useContractAddress } from '../hooks';
import {
  SubsetDataByNullifierQuery,
  SubsetDataByNullifierQueryDocument
} from '../query';

export function useSubsetDataByNullifier() {
  const [recentWithdrawal] = useAtom(recentWithdrawalAtom);
  const [subsetMetadata, setSubsetMetadata] = useAtom(subsetMetadataAtom);

  const { contractAddress } = useContractAddress();

  const [result, executeSubsetDatasQuery] =
    useQuery<SubsetDataByNullifierQuery>({
      query: SubsetDataByNullifierQueryDocument,
      variables: {
        contractAddress: contractAddress.toLowerCase(),
        nullifier: recentWithdrawal.nullifier.toLowerCase(),
        subsetRoot: recentWithdrawal.subsetRoot.toLowerCase()
      }
      // requestPolicy: 'cache-and-network'
    });
    
  useEffect(() => {
    executeSubsetDatasQuery({
      contractAddress: contractAddress.toLowerCase(),
      nullifier: recentWithdrawal.nullifier.toLowerCase(),
      subsetRoot: recentWithdrawal.subsetRoot.toLowerCase()
    });

  }, [recentWithdrawal, contractAddress]);

  useEffect(() => {
    if (
      Array.isArray(result?.data?.subsetDatas) &&
      result!.data!.subsetDatas.length === 1
    ) {
      const { accessType, bitLength, subsetData } =
        result!.data!.subsetDatas[0];
      setSubsetMetadata({
        accessType: accessType === '1' ? 'blocklist' : 'allowlist',
        bitLength: Number(bitLength),
        subsetData: Buffer.from(subsetData.slice(2), 'hex')
      });
    } else {
      setSubsetMetadata({
        accessType: 'blocklist',
        bitLength: NaN,
        subsetData: Buffer.alloc(0)
      });
    }
  }, [result, setSubsetMetadata]);

  return { subsetMetadata, executeSubsetDatasQuery };
}
