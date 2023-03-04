import { BigNumber, BigNumberish } from 'ethers';
import { poseidon } from 'pools-ts';
import { Commitment } from '../state';
import { useCommitments, useNote, useDebounce } from '../hooks';

export function useExistingCommitments() {
  const { commitments } = useCommitments();
  const { commitment, secret } = useNote();
  const debouncedCommitments = useDebounce<Commitment[]>(commitments, 500);

  let leafIndexToIndex: { [leafIndex: number]: number } = {};
  let existingCommitments: (Commitment & { nullifier: string })[] = [];

  if (!debouncedCommitments || !commitment || !secret) {
    return { existingCommitments, leafIndexToIndex };
  }

  for (let i = 0; i < debouncedCommitments.length; i++) {
    const commitmentData = debouncedCommitments[i];
    if (
      BigNumber.from(commitmentData.commitment).eq(commitment as BigNumberish)
    ) {
      leafIndexToIndex[Number(commitmentData.leafIndex)] =
        existingCommitments.length;
      existingCommitments.push({
        nullifier: poseidon([
          secret,
          1,
          commitmentData.leafIndex
        ] as BigNumberish[]).toHexString(),
        ...commitmentData
      });
    }
  }

  return { existingCommitments, leafIndexToIndex };
}
