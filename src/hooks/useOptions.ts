import { useNetwork } from 'wagmi';
import { assets, denominations } from '../constants';
import { useAtom } from 'jotai';
import { assetAtom } from '../state/atoms';

export function useOptions() {
  const [asset] = useAtom(assetAtom);
  const { chain } = useNetwork();

  let assetOptions: string[] = [];
  let denominationOptions: number[] = [];

  if (!chain || !chain.id) {
    return { assetOptions, denominationOptions };
  }

  if (
    Object.keys(assets).includes(chain.id.toString()) &&
    Array.isArray(assets[chain.id])
  ) {
    assetOptions = assets[chain.id];
  }

  if (
    Object.keys(denominations).includes(chain.id.toString()) &&
    Array.isArray(denominations[chain.id][asset])
  ) {
    denominationOptions = denominations[chain.id][asset];
  }

  return { assetOptions, denominationOptions };
}
