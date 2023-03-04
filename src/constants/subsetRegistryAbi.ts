export const subsetRegistryABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'subsetRoot',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'nullifier',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'pool',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'accessType',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bitLength',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'subsetData',
        type: 'bytes'
      }
    ],
    name: 'Subset',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'pools',
        type: 'address[]'
      }
    ],
    name: 'addPools',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'privacyPools',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'pools',
        type: 'address[]'
      }
    ],
    name: 'removePools',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'privacyPool',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'accessType',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'bitLength',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'subsetData',
        type: 'bytes'
      },
      {
        internalType: 'uint256[8]',
        name: 'flatProof',
        type: 'uint256[8]'
      },
      {
        internalType: 'bytes32',
        name: 'root',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 'subsetRoot',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 'nullifier',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'relayer',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    name: 'withdrawAndRecord',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
