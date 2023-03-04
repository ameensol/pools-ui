import { SubsetRoot } from '../state/atoms';

export interface SubsetRootsByTimestampQuery {
  subsetRoots: SubsetRoot[];
}

export const SubsetRootsByTimestampDocument = /* GraphQL */ `
  query SubsetRootsByTimestamp($timestamp: BigInt, $contractAddress: Bytes!) {
    subsetRoots(
      orderBy: timestamp
      contractAddress: $contractAddress
      where: { timestamp_gt: $timestamp }
    ) {
      subsetRoot
      relayer
      recipient
      nullifier
      sender
    }
  }
`;

export interface SubsetRootsByRelayerQuery {
  subsetRoots: {
    subsetRoot: string;
    recipient: string;
    nullifier: string;
    sender: string;
  };
}

export const SubsetRootsByRelayerDocument = /* GraphQL */ `
  query SubsetRootsByRelayer(
    $timestamp: BigInt
    $contractAddress: Bytes!
    $relayer: Bytes!
  ) {
    subsetRoots(
      orderBy: timestamp
      where: {
        contractAddress: $contractAddress
        timestamp_gt: $timestamp
        relayer: $relayer
      }
    ) {
      subsetRoot
      recipient
      nullifier
      sender
    }
  }
`;

export interface SubsetRootsBySenderQuery {
  subsetRoots: {
    subsetRoot: string;
    relayer: string;
    recipient: string;
    nullifier: string;
  };
}

export const SubsetRootsBySenderDocument = /* GraphQL */ `
  query SubsetRootsBySender(
    $timestamp: BigInt
    $contractAddress: Bytes!
    $sender: Bytes!
  ) {
    subsetRoots(
      orderBy: timestamp
      where: {
        contractAddress: $contractAddress
        timestamp_gt: $timestamp
        sender: $sender
      }
    ) {
      subsetRoot
      recipient
      nullifier
      relayer
    }
  }
`;
