import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { MerkleTree } from 'pools-ts';
import { hexZeroPad } from 'ethers/lib/utils';
import { depositsTreeAtom, Commitment } from '../state';
import { useCommitments, useDebounce } from '../hooks';

export function useDepositsTree() {
  const [depositsTree, setDepositsTree] = useAtom(depositsTreeAtom);
  const { commitments } = useCommitments();
  const debouncedCommitments = useDebounce<Commitment[]>(commitments, 500);

  useEffect(() => {
    if (debouncedCommitments && debouncedCommitments.length > 0) {
      if (depositsTree.length === 0) {
        const tree = new MerkleTree({
          leaves: debouncedCommitments.map(({ commitment }) =>
            hexZeroPad(commitment.toString(), 32)
          ),
          zeroString: 'empty'
        });
        setDepositsTree(tree);
      } else if (depositsTree.length < debouncedCommitments.length) {
        const tree = MerkleTree.fromJSON(depositsTree.toJSON());
        for (
          let i = depositsTree.length;
          i < debouncedCommitments.length;
          i++
        ) {
          tree.insert(debouncedCommitments[i].commitment);
        }
        setDepositsTree(tree);
      }
    }
  }, [debouncedCommitments, depositsTree, setDepositsTree]);

  return { depositsTree };
}
