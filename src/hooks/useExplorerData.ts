import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { AccessList } from 'pools-ts';
import { recentWithdrawalAtom, Commitment } from '../state';
import {
  useCommitments,
  useDebounce,
  useSubsetDataByNullifier
} from '../hooks';

export interface ExplorerDataI {
  accessList: AccessList;
  includedDeposits: Commitment[];
  excludedDeposits: Commitment[];
}

const defaultExplorerData: ExplorerDataI = {
  accessList: AccessList.fullEmpty({
    accessType: 'blocklist',
    subsetLength: 0
  }),
  includedDeposits: [],
  excludedDeposits: []
};

export function useExplorerData() {
  const { commitments } = useCommitments();
  const [recentWithdrawal] = useAtom(recentWithdrawalAtom);

  const debouncedCommitments = useDebounce(commitments, 500);
  const debouncedRecentWithdrawal = useDebounce(recentWithdrawal, 500);
  const { subsetMetadata } = useSubsetDataByNullifier();

  const { nullifier, subsetRoot } = debouncedRecentWithdrawal;
  const { accessType, bitLength, subsetData: data } = subsetMetadata;
  
  const [explorerData, setExplorerData] = useState<ExplorerDataI>(defaultExplorerData);
  
  useEffect(() => {
    if (
      !nullifier ||
      !subsetRoot ||
      !debouncedCommitments.length ||
      !accessType ||
      isNaN(bitLength) ||
      data.length === 0
    ) {
      return setExplorerData(defaultExplorerData);
    }
    const accessList = new AccessList({
      accessType,
      bytesData: { bitLength, data }
    });
    let includedDeposits: Commitment[];
    let excludedDeposits: Commitment[];
    if (commitments.length >= accessList.length) {
      let start = 0;
      const end = accessList.length;
      if (end > 30) {
        start = end - 30;
      }
      const c = commitments.slice(start, end);
      includedDeposits = c.filter(
        ({ leafIndex }) => accessList.subsetData[Number(leafIndex)] === 0
      );
      excludedDeposits = c.filter(
        ({ leafIndex }) => accessList.subsetData[Number(leafIndex)] === 1
      );
    } else {
      includedDeposits = [];
      excludedDeposits = [];
    }
    setExplorerData({
      accessList,
      includedDeposits,
      excludedDeposits
    });

  }, [nullifier, subsetRoot, debouncedCommitments, accessType, bitLength, data]);

  return explorerData;

}
