import { BigNumber } from 'ethers';
import { hexZeroPad } from 'ethers/lib/utils';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { AccessList, MerkleTree, BytesData, SubsetData } from 'pools-ts';

export type EncryptedJson = {
  address?: string;
  crypto?: {
    cipher: string;
    cipherparams: {
      iv: string;
    };
    ciphertext: string;
  };
  kdf?: string;
  kdfparams?: {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt: string;
  };
  mac?: string;
  id?: string;
  version?: number;
  'x-ethers'?: {
    client: string;
    gethFilename: string;
    locale: string;
    mnemonicCiphertext: string;
    mnemonicCounter: string;
    path: string;
    version: string;
  };
};

export type Commitment = {
  commitment: string;
  leafIndex: string;
  sender: string;
};

export type SubsetRoot = {
  subsetRoot: string;
  relayer: string;
  recipient: string;
  nullifier: string;
  sender: string;
};

export type Note = {
  commitment: BigNumber;
  secret: BigNumber;
  index: number;
};

export type Proof = {
  pi_a: BigNumber[];
  pi_b: BigNumber[][];
  pi_c: BigNumber[];
};

export type SolidityInput = {
  flatProof: string[];
  root: string;
  subsetRoot: string;
  nullifier: string;
  recipient: string;
  relayer: string;
  fee: string;
};

export type ZKProofMetadata = {
  contractAddress: string;
  asset: string;
  denomination: string;
  chainId: number;
  accessType: string;
  bitLength: number;
  subsetData: SubsetData;
  bytesData: BytesData;
};

export type ZKProof = {
  proof: Proof;
  publicSignals: BigNumber[];
  solidityInput: SolidityInput;
  metadata: ZKProofMetadata;
};

export type RecentWithdrawal = {
  recipient: string;
  nullifier: string;
  subsetRoot: string;
  relayer?: string;
  denomination?: string;
  fee?: string;
};

export type ZKeyOrWasm = {
  type: 'mem';
  data: Buffer;
};

type Stage = 'Connect' | 'Unlock' | 'Manage' | 'Create';

// note wallet
export const DefaultNote: Note = {
  index: 0,
  commitment: BigNumber.from(0),
  secret: BigNumber.from(0)
};
export const stageAtom = atom<Stage>('Connect');
export const mnemonicAtom = atom<string>('');
export const noteAtom = atom<Note>(DefaultNote);
export const encryptedJsonAtom = atomWithStorage<EncryptedJson>(
  'encryptedJson',
  {}
);
export const activeIndexAtom = atomWithStorage<number>('activeIndex', 0);
export const downloadUrlAtom = atom<string>('');

// pool explorer
export const assetAtom = atom<string>('ETH');
export const denominationAtom = atom<string>('0.001');

// withdraw form
export const nullifierAtom = atom<BigNumber>(BigNumber.from(0));
export const leafIndexAtom = atom<number>(NaN);
export const recipientAtom = atom<string>('');
export const relayerAtom = atom<string>(
  '0x000000000000000000000000000000000000dead'
);
export const feeAtom = atom<string>('0');
export const zkProofAtom = atom<ZKProof | null>(null);

// withdrawals
export const subsetRootsAtom = atom<SubsetRoot[]>([]);
export const spentNullifiersAtom = atom<Record<string, boolean>>((get) => {
  const nullifiers = get(subsetRootsAtom).map(
    (subsetRoot) => subsetRoot.nullifier
  );
  const spentNullifiers: Record<string, boolean> = {};
  for (const nullifier of nullifiers) {
    spentNullifiers[hexZeroPad(nullifier.toString(), 32)] = true;
  }
  return spentNullifiers;
});

// deposits
export const commitmentsAtom = atom<Commitment[]>([]);
export const depositsTreeAtom = atom<MerkleTree>(
  new MerkleTree({ leaves: [] })
);
export const depositsRootAtom = atom<BigNumber>(
  (get) => get(depositsTreeAtom).root
);

// withdrawal subsets
export const accessListAtom = atom<AccessList>(
  new AccessList({ accessType: 'blocklist' })
);
export const subsetRootAtom = atom<BigNumber>(
  (get) => get(accessListAtom).root
);

// explorer
export type SubsetMetaData = {
  accessType: string;
  bitLength: number;
  subsetData: Buffer;
};

export const subsetMetadataAtom = atom<SubsetMetaData>({
  accessType: '',
  bitLength: NaN,
  subsetData: Buffer.alloc(0)
});

export const recentWithdrawalAtom = atom<RecentWithdrawal>({
  recipient: '',
  nullifier: '',
  subsetRoot: ''
});

// zkeys
export const zkeyBytesAtom = atom<ZKeyOrWasm>({
  type: 'mem',
  data: Buffer.alloc(0)
});
export const wasmBytesAtom = atom<ZKeyOrWasm>({
  type: 'mem',
  data: Buffer.alloc(0)
});
