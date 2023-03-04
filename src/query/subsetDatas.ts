export interface SubsetDataByNullifierQuery {
  subsetDatas: {
    accessType: string;
    bitLength: string;
    subsetData: string;
  }[];
}

export const SubsetDataByNullifierQueryDocument = /* GraphQL */ `
  query SubsetDataByNullifier(
    $contractAddress: Bytes!
    $subsetRoot: Bytes!
    $nullifier: Bytes!
  ) {
    subsetDatas(
      where: {
        contractAddress: $contractAddress
        subsetRoot: $subsetRoot
        nullifier: $nullifier
      }
    ) {
      accessType
      bitLength
      subsetData
    }
  }
`;
