import { BigNumber } from 'ethers';
import { useAtom } from 'jotai';
import { noteAtom, Note } from '../state/atoms';

export function useNote(): Note {
  const [note] = useAtom(noteAtom);
  return {
    index: note.index,
    commitment: BigNumber.from(note.commitment.toString()),
    secret: BigNumber.from(note.secret.toString())
  };
}
