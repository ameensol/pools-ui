import {
  Container,
  Heading,
  Link,
  Stat,
  HStack,
  VStack,
  StatLabel,
  Text,
  StatHelpText,
  Select,
  Spinner
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useBalance, useContractReads, useNetwork } from 'wagmi';
import { useAtom } from 'jotai';
import { useContractAddress, useOptions } from '../hooks';
import { assetAtom, denominationAtom } from '../state';
import { privacyPoolABI } from '../constants';
import { pinchString } from '../utils';

export function PoolExplorer() {
  const [asset, setAsset] = useAtom(assetAtom);
  const [denomination, setDenomination] = useAtom(denominationAtom);

  const { chain } = useNetwork();
  const { contractAddress } = useContractAddress();
  const { assetOptions, denominationOptions } = useOptions();

  const {
    data: poolData,
    isError: isPoolDataError,
    isLoading: isPoolDataLoading
  } = useContractReads({
    contracts: [
      {
        address: contractAddress,
        abi: privacyPoolABI,
        functionName: 'getLatestRoot'
      },
      {
        address: contractAddress,
        abi: privacyPoolABI,
        functionName: 'currentLeafIndex'
      }
    ]
  });

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError
  } = useBalance({
    address: contractAddress as `0x${string}`
  });

  return (
    <Container minW="216px" maxW="98vw">
      <Container
        my={8}
        p={4}
        pb={2}
        bg="white"
        borderRadius={16}
        boxShadow="2xl"
      >
        <VStack align="center" mb={2}>
          <Heading fontSize="2xl">
            {denomination} {asset} Pool
          </Heading>
          <Link
            as={NextLink}
            isExternal
            href={`${chain?.blockExplorers?.default.url}/address/${contractAddress}`}
          >
            <Text color="gray.800" fontWeight="bold" wordBreak="break-all">
              {pinchString(contractAddress, 8)} <ExternalLinkIcon />
            </Text>
          </Link>

          <Container px={0} py={2}>
            <HStack w="full">
              <Select
                size="md"
                bg="gray.100"
                onChange={(e) => setDenomination(e.target.value)}
                defaultValue={denomination}
              >
                {denominationOptions.map((_denomination, i) => (
                  <option
                    value={_denomination}
                    key={`${_denomination}-${i}-option`}
                  >
                    {_denomination.toString()}
                  </option>
                ))}
              </Select>
              <Select
                size="md"
                bg="gray.100"
                onChange={(e) => setAsset(e.target.value)}
                defaultValue={asset}
              >
                {assetOptions.map((_asset, i) => (
                  <option value={_asset} key={`${_asset}-${i}-option`}>
                    {_asset.toString()}
                  </option>
                ))}
              </Select>
            </HStack>
          </Container>
        </VStack>

        <HStack justify="space-between" pb={2}>
          <VStack align="flex-start">
            <Stat>
              <StatLabel fontSize="lg">Pool Balance</StatLabel>
              <Text fontWeight="bold" fontSize="2xl">
                {isBalanceLoading ? (
                  <Spinner />
                ) : isBalanceError ? (
                  '--'
                ) : (
                  balanceData?.formatted
                )}
              </Text>
              <StatHelpText fontSize="lg">
                {balanceData?.symbol === asset
                  ? asset
                  : `${balanceData?.symbol} (${asset})`}
              </StatHelpText>
            </Stat>
          </VStack>

          <VStack align="flex-end">
            <Stat>
              <StatLabel fontSize="lg">Total</StatLabel>
              <Text fontWeight="bold" fontSize="2xl">
                {isPoolDataLoading ? (
                  <Spinner />
                ) : isPoolDataError ? (
                  '--'
                ) : (
                  (
                    ((poolData as [string, BigInt]) || [null, null])[1] || 0
                  ).toString()
                )}
              </Text>
              <StatHelpText
                textAlign="right"
                fontSize="lg"
                wordBreak="break-word"
              >
                # of Deposits
              </StatHelpText>
            </Stat>
          </VStack>
        </HStack>

        <Stat>
          <StatLabel fontSize="lg">Root</StatLabel>
          <Text fontWeight="bold" fontSize="lg" w="50%">
            {isPoolDataLoading ? (
              <Spinner />
            ) : isPoolDataError ? (
              '--'
            ) : (
              pinchString(
                (
                  ((poolData as [string, BigInt]) || [null, null])[0] || 0
                ).toString(),
                10
              )
            )}
          </Text>
          <StatHelpText fontSize="sm">Most Recent Root</StatHelpText>
        </Stat>
      </Container>
    </Container>
  );
}

export default PoolExplorer;
