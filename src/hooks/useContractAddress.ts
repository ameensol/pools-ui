import { useNetwork } from 'wagmi';
import { contracts, subsetRegistries } from '../constants';
import { useAtom } from 'jotai';
import { assetAtom, denominationAtom } from '../state/atoms';

export function useContractAddress() {
  const [asset] = useAtom(assetAtom);
  const [denomination] = useAtom(denominationAtom);
  const { chain } = useNetwork();

  if (!chain || !Object.keys(contracts).includes(chain.id.toString()))
    return { contractAddress: '', subsetRegistry: '' };

  return {
    contractAddress: contracts[chain.id][`${asset}-${denomination}`],
    subsetRegistry: subsetRegistries[chain.id]
  };
}
